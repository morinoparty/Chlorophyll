// @react-three/fiber の要素("mesh" "boxGeometry" "meshBasicMaterial" 等)を JSX で使えるようにする。
// パッケージ側の自動拡張が効かない環境向けに明示的に登録する
import type { ThreeElements } from "@react-three/fiber";

declare module "react" {
    namespace JSX {
        interface IntrinsicElements extends ThreeElements {}
    }
}
