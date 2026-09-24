import { createPalette } from "./create-palette";

// ステータス色(error / danger)
export const red = createPalette("red", {
    // focus.ring = red.9(計測値: 白 Lc 65.0 / bg Lc 56.3。step8 は bg に対して Lc 41.4 で届かない)
});
