import { createPalette } from "./create-palette";

// ステータス色(info)
export const blue = createPalette("blue", {
    // focus.ring = blue.9(計測値: 白 Lc 58.4 / bg Lc 50.0。step8 は bg に対して Lc 32.4 で届かない)
});
