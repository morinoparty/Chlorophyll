import { createPalette } from "./create-palette";

// 中立色。他パレットの fg.muted / グローバルの bg・fg・border もこのスケールを参照する
export const gray = createPalette("gray", {
    // 有彩色パレットの bg は step3 に gray.3 を混ぜ、彩度差で surface と分離させたまま沈めている。
    // gray にはその彩度の余地が無く(step2 と step3 の ΔE2000 が元々 1.87 しかない)、
    // 沈めると surface と見分けが付かなくなるため、このパレットだけ step2 のまま据え置く
    bg: "{colors.gray.2}",
    // focus.ring = gray.9(計測値: 白 Lc 60.4 / bg Lc 51.6。step8 は白 Lc 36.5 / bg Lc 27.7 で届かない)
});
