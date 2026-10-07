import { PlayerAnimation, type PlayerObject } from "skinview3d";
import { BoxGeometry, Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, PointLight } from "three";

// Minecraft の松明は 2x10x2 px の棒の先端 2px が炎になっている。skin の 1px = three の 1 単位
const STICK_LENGTH = 8;
const FLAME_LENGTH = 2;
const TORCH_WIDTH = 2;
// 腕のローカル座標系での握る位置(arm pivot が y=-4、腕の長さ 12 で手先は y=-10)。
// 手先より少し腕側にして、拳で握っているように見せる
const GRIP_Y = -9;
// 握った位置から棒の下端までの長さ。棒の下の方を握る
const STICK_BELOW_GRIP = 2;
// 腕を前方に掲げる角度(rad)。-π で真上、-π/2 で真正面
const ARM_RAISE_X = -Math.PI * 0.62;

// 松明を組み立てる。握る位置を原点にし、torch ローカルの +y 方向へ棒と炎を伸ばす
const createTorch = () => {
    const torch = new Group();
    torch.name = "torch";
    torch.position.y = GRIP_Y;
    // 腕を傾けても松明が鉛直に立つよう、腕の x 回転を打ち消す
    torch.rotation.x = -ARM_RAISE_X;

    const stick = new Mesh(
        new BoxGeometry(TORCH_WIDTH, STICK_LENGTH, TORCH_WIDTH),
        new MeshStandardMaterial({ color: 0x6b4a2b }),
    );
    stick.position.y = STICK_LENGTH / 2 - STICK_BELOW_GRIP;

    // 炎はライティングの影響を受けずに光って見えるよう MeshBasicMaterial にする
    const flame = new Mesh(
        new BoxGeometry(TORCH_WIDTH, FLAME_LENGTH, TORCH_WIDTH),
        new MeshBasicMaterial({ color: 0xffd65a }),
    );
    flame.position.y = STICK_LENGTH - STICK_BELOW_GRIP + FLAME_LENGTH / 2;

    // 炎の周囲(顔や腕)をほんのり暖色で照らす。強すぎると肌が白飛びするので控えめにする
    const light = new PointLight(0xffa040, 0, 24, 1);
    light.position.y = flame.position.y;

    torch.add(stick, flame, light);
    return { torch, light };
};

// 右手で松明を前方に掲げるポーズ。炎のゆらぎに合わせて光の強さを揺らす
class TorchAnimation extends PlayerAnimation {
    private readonly torch: Group;
    private readonly light: PointLight;

    constructor() {
        super();
        const { torch, light } = createTorch();
        this.torch = torch;
        this.light = light;
    }

    protected animate(player: PlayerObject): void {
        const t = this.progress * 2;
        const { skin } = player;

        // 松明を右腕に取り付ける。animation の切り替え時に resetJoints されても子要素は残るため、
        // 取り付けは初回だけでよい
        if (this.torch.parent !== skin.rightArm) {
            skin.rightArm.add(this.torch);
        }
        // slim(3px 腕)とclassic(4px 腕)で腕の中心がずれるので、腕メッシュの中心に合わせる
        this.torch.position.x = skin.modelType === "slim" ? -0.5 : -1;

        // 右腕を前方斜め上に掲げ、呼吸に合わせてわずかに揺らす。
        // 揺れは松明の傾き補正には含めないので、炎もわずかに揺れて見える
        skin.rightArm.rotation.x = ARM_RAISE_X + Math.sin(t) * 0.02;
        // 外側(-x 側)へ少し開く
        skin.rightArm.rotation.z = -0.1;

        // 左腕は idle と同じく自然に垂らしてゆっくり揺らす
        skin.leftArm.rotation.z = Math.cos(t) * 0.03 + Math.PI * 0.02;

        // 頭は掲げた松明の方を少し見上げる
        skin.head.rotation.x = -0.2;
        skin.head.rotation.y = -0.25;

        // 周期の異なる sin を重ねて不規則な炎のゆらぎにする
        this.light.intensity = 12 + Math.sin(t * 7) * 2 + Math.sin(t * 13) * 1.5;

        player.cape.rotation.x = Math.PI * 0.06 + Math.sin(t) * 0.01;
    }

    /** 右腕から松明を外し、GPU リソースを解放する */
    dispose(): void {
        this.torch.removeFromParent();
        this.torch.traverse((object) => {
            if (object instanceof Mesh) {
                object.geometry.dispose();
                object.material.dispose();
            }
        });
        this.light.dispose();
    }
}

export { TorchAnimation };
