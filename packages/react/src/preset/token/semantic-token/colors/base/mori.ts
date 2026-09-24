import { createPalette } from "./create-palette";

// ブランドカラー(森)。brandColor: "mori" のときの colorPalette
export const mori = createPalette("mori", {
    // focus.ring = mori.9(計測値: 白 Lc 73.7 / bg Lc 65.5。step8 は bg に対して Lc 38.4 で届かない)
});
