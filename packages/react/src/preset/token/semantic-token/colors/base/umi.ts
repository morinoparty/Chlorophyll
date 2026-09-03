import { createPalette } from "./create-palette";

// ブランドカラー(海)。brandColor: "umi" のときの colorPalette
export const umi = createPalette("umi", {
    // focus.ring = umi.9(計測値: 白 Lc 73.1 / bg Lc 65.0。step8 は bg に対して Lc 38.0 で届かない)
});
