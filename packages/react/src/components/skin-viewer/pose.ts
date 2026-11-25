import { PlayerAnimation, type PlayerObject } from "skinview3d";

/**
 * 1 つの関節の回転(度)。省略した軸はアニメーションの値(アニメーションが無ければ 0 = 直立)のまま。
 * 軸は skinview3d(three.js)の関節のローカル軸で、x が前後、y がひねり、z が左右の開き。
 * 例: rightArm.x = -90 で右腕を真正面に上げる / head.x = 20 でうつむく / head.y = 30 で左を向く
 */
interface SkinViewerJointRotation {
    x?: number;
    y?: number;
    z?: number;
}

/** 関節ごとの回転。指定した軸だけを上書きする */
interface SkinViewerPose {
    head?: SkinViewerJointRotation;
    body?: SkinViewerJointRotation;
    rightArm?: SkinViewerJointRotation;
    leftArm?: SkinViewerJointRotation;
    rightLeg?: SkinViewerJointRotation;
    leftLeg?: SkinViewerJointRotation;
}

type SkinViewerJoint = keyof SkinViewerPose;
type JointAxis = keyof SkinViewerJointRotation;

const JOINTS: readonly SkinViewerJoint[] = ["head", "body", "rightArm", "leftArm", "rightLeg", "leftLeg"];
const AXES: readonly JointAxis[] = ["x", "y", "z"];

const DEG_TO_RAD = Math.PI / 180;

/** 回転を持つ関節の最小限の形。テストで skinview3d の実体を作らずに済むよう構造的に受け取る */
type JointRotations = Record<SkinViewerJoint, { rotation: Record<JointAxis, number> }>;

// 角度を (-π, π] に畳む。skinview3d の wave は rotation.x = 180(rad)のような
// 何周もした値を入れるため、そのまま縮めると腕がぐるぐる回ってしまう
const wrapAngle = (radians: number): number => {
    const wrapped = radians - 2 * Math.PI * Math.floor((radians + Math.PI) / (2 * Math.PI));
    return wrapped === -Math.PI ? Math.PI : wrapped;
};

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

/**
 * 2 つのポーズを t(0〜1)で線形補間する。片方にしか無い軸は、もう片方を 0(直立)として補間する。
 * t = 0 で from、t = 1 で to と同じ角度になる
 */
const interpolateSkinViewerPose = (from: SkinViewerPose, to: SkinViewerPose, t: number): SkinViewerPose => {
    const ratio = clamp01(t);
    const result: SkinViewerPose = {};
    for (const joint of JOINTS) {
        const a = from[joint];
        const b = to[joint];
        if (!a && !b) {
            continue;
        }
        const rotation: SkinViewerJointRotation = {};
        for (const axis of AXES) {
            const start = a?.[axis];
            const end = b?.[axis];
            if (start === undefined && end === undefined) {
                continue;
            }
            rotation[axis] = (start ?? 0) + ((end ?? 0) - (start ?? 0)) * ratio;
        }
        result[joint] = rotation;
    }
    return result;
};

/** アニメーションが付けた関節の回転を weight(0〜1)倍に縮める。0 で直立、1 でそのまま */
const scaleJointRotations = (skin: JointRotations, weight: number) => {
    const ratio = clamp01(weight);
    if (ratio === 1) {
        return;
    }
    for (const joint of JOINTS) {
        const { rotation } = skin[joint];
        for (const axis of AXES) {
            rotation[axis] = wrapAngle(rotation[axis]) * ratio;
        }
    }
};

/** ポーズで指定された軸を上書きし、上書きした "関節.軸" の一覧を返す */
const applySkinViewerPose = (skin: JointRotations, pose: SkinViewerPose | undefined): string[] => {
    const applied: string[] = [];
    if (!pose) {
        return applied;
    }
    for (const joint of JOINTS) {
        const rotation = pose[joint];
        if (!rotation) {
            continue;
        }
        for (const axis of AXES) {
            const degrees = rotation[axis];
            // NaN などが入っても関節が消えないよう、有限の数だけを反映する
            if (degrees === undefined || !Number.isFinite(degrees)) {
                continue;
            }
            skin[joint].rotation[axis] = degrees * DEG_TO_RAD;
            applied.push(`${joint}.${axis}`);
        }
    }
    return applied;
};

/** 前フレームで上書きした軸を 0(直立)に戻す。上書きをやめた軸に古い角度が残らないようにする */
const resetAppliedAxes = (skin: JointRotations, applied: readonly string[]) => {
    for (const key of applied) {
        const [joint, axis] = key.split(".") as [SkinViewerJoint, JointAxis];
        skin[joint].rotation[axis] = 0;
    }
};

interface PoseState {
    pose?: SkinViewerPose;
    animationWeight?: number;
}

// 元のアニメーション(無ければ静止)を再生したうえで、毎フレーム weight で縮め、pose で上書きするアニメーション。
// pose / weight は getState から毎フレーム読むので、値が変わってもアニメーションを作り直さない
// (作り直すと skinview3d が関節と再生位置をリセットし、動きが途切れる)
class PosedAnimation extends PlayerAnimation {
    private applied: string[] = [];
    private readonly inner: PlayerAnimation | null;
    private readonly getState: () => PoseState;

    constructor(inner: PlayerAnimation | null, getState: () => PoseState) {
        super();
        this.inner = inner;
        this.getState = getState;
    }

    protected animate(player: PlayerObject, delta: number): void {
        const { skin } = player;
        const { pose, animationWeight = 1 } = this.getState();
        resetAppliedAxes(skin, this.applied);
        this.inner?.update(player, delta);
        scaleJointRotations(skin, animationWeight);
        this.applied = applySkinViewerPose(skin, pose);
    }
}

export type { JointRotations, SkinViewerJoint, SkinViewerJointRotation, SkinViewerPose };
export { applySkinViewerPose, interpolateSkinViewerPose, PosedAnimation, scaleJointRotations, wrapAngle };
