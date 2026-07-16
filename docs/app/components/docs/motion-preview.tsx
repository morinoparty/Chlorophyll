"use client";

import { motion } from "motion/react";
import { sva } from "styled-system/css";

// duration / easing トークンのプレビュー。トラック上をボールが実際のトークン値で移動する
const previewStyles = sva({
    slots: ["track", "ball"],
    base: {
        track: {
            position: "relative",
            width: "full",
            minWidth: "[160px]",
            height: "6",
            borderRadius: "full",
            // ページ背景と同化しないよう、うっすら濃い中立色でトラックを見せる
            backgroundColor: "gray.a3",
            overflow: "hidden",
        },
        ball: {
            position: "absolute",
            top: "1",
            left: "0",
            width: "4",
            height: "4",
            borderRadius: "full",
            backgroundColor: "colorPalette.solid",
        },
    },
});

// "150ms" / "0.2s" を秒数に変換する。解釈できない値はデフォルトの 0.3 秒にする
export function parseDurationSeconds(value: string): number {
    const match = value.match(/([\d.]+)\s*(ms|s)/);
    if (!match) return 0.3;
    const amount = Number.parseFloat(match[1]);
    return match[2] === "ms" ? amount / 1000 : amount;
}

// cubic-bezier CSS 値を motion の ease プロパティ形式に変換する
export function parseEaseValue(value: string): [number, number, number, number] | "linear" {
    if (value === "linear") return "linear";
    const match = value.match(/cubic-bezier\(([^)]+)\)/);
    if (!match) return "linear";
    const parts = match[1].split(",").map((s) => Number.parseFloat(s.trim()));
    if (parts.length !== 4 || parts.some(Number.isNaN)) return "linear";
    return parts as [number, number, number, number];
}

interface MotionBallProps {
    /** 移動にかける秒数 */
    duration: number;
    /** motion に渡すイージング */
    ease: [number, number, number, number] | "linear";
}

// トークン値そのままの duration / ease で端から端まで移動するボール
export function MotionBall({ duration, ease }: MotionBallProps) {
    const preview = previewStyles();

    return (
        <div className={preview.track}>
            <motion.div
                className={preview.ball}
                initial={{ left: "0px" }}
                animate={{ left: "calc(100% - 1rem)" }}
                transition={{
                    duration,
                    ease,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    // 短い duration でも差がわかるよう、移動ごとに一拍置く
                    repeatDelay: 1,
                }}
            />
        </div>
    );
}
