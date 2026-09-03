import { createPalette } from "./create-palette";

// ステータス色(warning)。solid(step9 / 10)が明るい塗り色なので、その上に載せる色だけ差し替える
export const yellow = createPalette("yellow", {
    // yellow.solid(step9)は明るいため、白ではなく暗いインク(light ランプの 12)を重ねてコントラストを確保する
    contrast: "{colors.yellow.light.12}",
    // yellow は 9 / 10 が明るい塗り色(白に対して Lc 12.9 / 16.9)でリングにならないため、
    // 基準(Lc 45)を満たす最初のステップである 11 を使う(計測値: 白 Lc 73.4 / bg Lc 65.6)
    focusRing: "{colors.yellow.11}",
});
