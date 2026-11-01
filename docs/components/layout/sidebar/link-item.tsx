import type { HTMLAttributes } from "react";
import type { LinkItemType } from "../link-item";
import type * as Base from "./base";

type InternalComponents = Pick<
    typeof Base,
    "SidebarFolder" | "SidebarFolderLink" | "SidebarFolderContent" | "SidebarFolderTrigger" | "SidebarItem"
>;

export function createLinkItemRenderer({
    SidebarFolder,
    SidebarFolderContent,
    SidebarFolderLink,
    SidebarFolderTrigger,
    SidebarItem,
}: InternalComponents) {
    /**
     * Render sidebar items from page tree
     */
    // biome-ignore lint/correctness/noComponentHookFactories: fumadocs-ui 由来のファクトリで、layout/docs/sidebar.tsx のモジュールトップレベルで一度だけ呼ばれるため毎レンダーで作り直されない
    return function SidebarLinkItem({
        item,
        ...props
    }: HTMLAttributes<HTMLElement> & {
        item: Exclude<LinkItemType, { type: "icon" }>;
    }) {
        if (item.type === "custom") return <div {...props}>{item.children}</div>;

        if (item.type === "menu")
            return (
                <SidebarFolder {...props}>
                    {item.url ? (
                        <SidebarFolderLink href={item.url} external={item.external}>
                            {item.icon}
                            {item.text}
                        </SidebarFolderLink>
                    ) : (
                        <SidebarFolderTrigger>
                            {item.icon}
                            {item.text}
                        </SidebarFolderTrigger>
                    )}
                    <SidebarFolderContent>
                        {item.items.map((child, i) => (
                            <SidebarLinkItem key={"url" in child ? child.url : `child-${i}`} item={child} />
                        ))}
                    </SidebarFolderContent>
                </SidebarFolder>
            );

        return (
            <SidebarItem href={item.url} icon={item.icon} external={item.external} {...props}>
                {item.text}
            </SidebarItem>
        );
    };
}
