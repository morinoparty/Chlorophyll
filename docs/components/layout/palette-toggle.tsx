"use client";
import { cva } from "class-variance-authority";
import { TreePine, Waves } from "lucide-react";
import { type HTMLAttributes, useEffect, useState } from "react";
import { cn } from "../../lib/cn";

type Palette = "mori" | "umi";

const itemVariants = cva("size-6.5 rounded-full p-1.5 text-fd-muted-foreground", {
    variants: {
        active: {
            true: "bg-fd-accent text-fd-accent-foreground",
            false: "text-fd-muted-foreground",
        },
    },
});

const palettes: [Palette, typeof TreePine][] = [
    ["mori", TreePine],
    ["umi", Waves],
];

export function PaletteToggle({
    className,
    mode = "toggle",
    ...props
}: HTMLAttributes<HTMLElement> & {
    mode?: "toggle" | "select";
}) {
    const [mounted, setMounted] = useState(false);
    const [palette, setPalette] = useState<Palette>("mori");

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem("color-palette") as Palette | null;
        if (saved === "mori" || saved === "umi") {
            setPalette(saved);
        }
    }, []);

    const changePalette = (newPalette: Palette) => {
        setPalette(newPalette);
        document.documentElement.setAttribute("data-color-palette", newPalette);
        localStorage.setItem("color-palette", newPalette);
    };

    const container = cn("inline-flex items-center rounded-full border p-1", className);

    if (mode === "toggle") {
        const value = mounted ? palette : null;

        return (
            <button
                className={container}
                aria-label="Toggle Palette"
                onClick={() => changePalette(value === "mori" ? "umi" : "mori")}
                data-palette-toggle=""
                {...props}
            >
                {palettes.map(([key, Icon]) => (
                    <Icon key={key} fill="currentColor" className={cn(itemVariants({ active: value === key }))} />
                ))}
            </button>
        );
    }

    const value = mounted ? palette : null;

    return (
        <div className={container} data-palette-toggle="" {...props}>
            {palettes.map(([key, Icon]) => (
                <button
                    type="button"
                    key={key}
                    aria-label={key}
                    className={cn(itemVariants({ active: value === key }))}
                    onClick={() => changePalette(key)}
                >
                    <Icon className="size-full" fill="currentColor" />
                </button>
            ))}
        </div>
    );
}
