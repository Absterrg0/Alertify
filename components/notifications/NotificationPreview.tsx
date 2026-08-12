import { Bell, Check, Info, Sparkles, TriangleAlert, X } from "lucide-react";
import type { CSSProperties } from "react";

import styles from "./NotificationPreview.module.css";

export type PreviewConfig = {
  type: "ALERT" | "ALERT_DIALOG" | "TOAST";
  preset: "MINIMAL" | "GLASS" | "AURORA" | "EDITORIAL" | "NEON";
  animation: "FADE" | "SLIDE" | "POP" | "SPRING" | "FLIP";
  title: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  borderColor: string;
  borderRadius: number;
  icon: "BELL" | "SPARKLES" | "CHECK" | "WARNING" | "INFO";
  ctaLabel?: string;
};

const icons = {
  BELL: Bell,
  SPARKLES: Sparkles,
  CHECK: Check,
  WARNING: TriangleAlert,
  INFO: Info,
};

export function NotificationPreview({ config, replayKey = 0 }: { config: PreviewConfig; replayKey?: number }) {
  const Icon = icons[config.icon];
  const variables = {
    "--background": config.backgroundColor,
    "--text": config.textColor,
    "--accent": config.accentColor,
    "--border": config.borderColor,
    "--radius": `${config.borderRadius}px`,
  } as CSSProperties;

  return (
    <div className={styles.stage} style={variables}>
      <div className={styles.browser} aria-hidden="true">
        <div className={styles.chrome}><i /><i /><i /></div>
      </div>
      <div
        key={`${config.animation}-${replayKey}`}
        className={`${styles.notification} ${styles[config.preset.toLowerCase()]} ${styles[config.animation.toLowerCase()]} ${config.type === "ALERT_DIALOG" ? styles.dialog : ""} ${config.type === "ALERT" ? styles.alert : ""}`}
        role="presentation"
      >
        <div className={styles.accent} aria-hidden="true" />
        <div className={styles.icon}><Icon size={17} strokeWidth={2.2} /></div>
        <div className={styles.copy}>
          <strong>{config.title || "Your campaign title"}</strong>
          <p>{config.description || "Write a concise message your visitors will understand immediately."}</p>
          {config.ctaLabel ? <span>{config.ctaLabel} →</span> : null}
        </div>
        <X className={styles.close} size={18} />
      </div>
    </div>
  );
}
