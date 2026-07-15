import browserCollections from "fumadocs-mdx:collections/browser";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { DocsLayout } from "../../../components/layout/docs";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "../../../components/layout/docs/page";
import { getMDXComponents } from "../../../mdx-components";
import { baseOptions } from "../../lib/layout.shared";
import { source } from "../../lib/source";

export const Route = createFileRoute("/docs/$")({
    component: Page,
    // ドキュメントはビルド時に確定する静的コンテンツなので、
    // ナビゲーションのたびに loader を再実行しないよう再検証を無効化する。
    staleTime: Number.POSITIVE_INFINITY,
    shouldReload: false,
    loader: async ({ params }) => {
        const slugs = params._splat?.split("/") ?? [];
        const data = await serverLoader({ data: slugs });
        await clientLoader.preload(data.path);
        return data;
    },
});

// serializePageTree はページツリー全体を再構築・再シリアライズする高コスト処理だが、
// 結果はビルド時に不変なので、サーバー起動後は一度だけ計算してモジュールレベルでキャッシュする。
let serializedPageTreeCache: ReturnType<typeof source.serializePageTree> | undefined;
function getSerializedPageTree() {
    if (!serializedPageTreeCache) {
        serializedPageTreeCache = source.serializePageTree(source.getPageTree());
    }
    return serializedPageTreeCache;
}

const serverLoader = createServerFn({
    method: "GET",
})
    .inputValidator((slugs: string[]) => slugs)
    .handler(async ({ data: slugs }) => {
        const page = source.getPage(slugs);
        if (!page) throw notFound();

        // キャッシュしたツリーは SSR 中に fumadocs の deserializePageTree が
        // React 要素を書き込んでミューテートするため、リクエストごとにコピーを返す。
        // （共有オブジェクトをそのまま返すと 2 リクエスト目以降のシリアライズが壊れる）
        return {
            path: page.path,
            pageTree: structuredClone(await getSerializedPageTree()),
        };
    });

const clientLoader = browserCollections.docs.createClientLoader({
    component({ toc, frontmatter, default: MDX }) {
        return (
            <DocsPage toc={toc}>
                <DocsTitle>{frontmatter.title}</DocsTitle>
                <DocsDescription>{frontmatter.description}</DocsDescription>
                <DocsBody>
                    <MDX
                        components={{
                            ...defaultMdxComponents,
                            ...getMDXComponents(),
                        }}
                    />
                </DocsBody>
            </DocsPage>
        );
    },
});

function Page() {
    const data = Route.useLoaderData();
    const { pageTree } = useFumadocsLoader(data);
    const Content = clientLoader.getComponent(data.path) as unknown as React.FC;

    return (
        <DocsLayout
            {...baseOptions()}
            nav={{
                ...baseOptions().nav,
                enabled: true,
            }}
            tree={pageTree}
            sidebar={{
                collapsible: false,
            }}
        >
            <Content />
        </DocsLayout>
    );
}
