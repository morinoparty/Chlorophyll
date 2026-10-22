import { PlayerAnimation, type PlayerObject } from "skinview3d";

// 右腕を前方に掲げる角度(rad)。-π/2 で真正面、-π で真上。
// Minecraft では手に持ったアイテムが腕と直交して前を向くため、腕を水平より少し上げると
// 松明などのアイテムがほぼ真上を向いて「掲げた」見た目になる
const ARM_RAISE_X = -Math.PI * 0.55;

// 右腕を前方に掲げるポーズ。rightHandItem と組み合わせると松明などを掲げた姿になる
class RaiseAnimation extends PlayerAnimation {
    protected animate(player: PlayerObject): void {
        const t = this.progress * 2;
        const { skin } = player;

        // 呼吸に合わせてわずかに揺らし、外側(-x 側)へ少し開く
        skin.rightArm.rotation.x = ARM_RAISE_X + Math.sin(t) * 0.02;
        skin.rightArm.rotation.z = -0.1;

        // 左腕は idle と同じく自然に垂らしてゆっくり揺らす
        skin.leftArm.rotation.z = Math.cos(t) * 0.03 + Math.PI * 0.02;

        // 頭は掲げた右手の方を少し見上げる
        skin.head.rotation.x = -0.2;
        skin.head.rotation.y = -0.25;

        player.cape.rotation.x = Math.PI * 0.06 + Math.sin(t) * 0.01;
    }
}

export { RaiseAnimation };
