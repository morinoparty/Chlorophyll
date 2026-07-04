import { defineRecipe } from "@pandacss/dev";

export const skinViewer = defineRecipe({
    className: "skin-viewer",
    jsx: ["SkinViewer"],
    description: "The skin viewer component",
    base: {
        display: "block",
        borderRadius: "lg",
        bg: "bg.subtle",
    },
});
