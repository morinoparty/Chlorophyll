"use client";
import { Clipboard } from "@ark-ui/react/clipboard";
import { CheckIcon, CopyIcon } from "lucide-react";
import { serverStatusCard } from "styled-system/recipes";
import { Badge } from "../badge";

interface ServerStatusCardProps {
    /** サーバーのバージョン(例: "1.21.11") */
    version: string;
    /** 接続先アドレス(例: "visit.morino.party") */
    address: string;
    /** 現在のオンライン人数 */
    onlineCount: number;
    /** 登録済みプレイヤー数 */
    registeredCount: number;
}

// Minecraft サーバーの状態を表示するプレゼンテーショナルなカード。
// データ取得は利用側の責務とし、このコンポーネントは受け取った値をそのまま表示するだけにする。
// Card(#40) がまだ実装されていないため、root は暫定的に自前でカード風の見た目を持たせている
const ServerStatusCard = ({ version, address, onlineCount, registeredCount }: ServerStatusCardProps) => {
    const styles = serverStatusCard();

    return (
        <div className={styles.root}>
            <div className={styles.header}>
                <Clipboard.Root value={address} className={styles.address}>
                    <Clipboard.Control>
                        <Clipboard.ValueText />
                    </Clipboard.Control>
                    <Clipboard.Trigger className={styles.addressTrigger}>
                        <Clipboard.Indicator copied={<CheckIcon />}>
                            <CopyIcon />
                        </Clipboard.Indicator>
                    </Clipboard.Trigger>
                </Clipboard.Root>
                <Badge status="success" dot>
                    {onlineCount} online
                </Badge>
            </div>
            <div className={styles.stats}>
                <div className={styles.stat}>
                    <span className={styles.statLabel}>Version</span>
                    <span className={styles.statValue}>{version}</span>
                </div>
                <div className={styles.stat}>
                    <span className={styles.statLabel}>Registered players</span>
                    <span className={styles.statValue}>{registeredCount}</span>
                </div>
            </div>
        </div>
    );
};

export { ServerStatusCard };
export type { ServerStatusCardProps };
