import { accordion } from "./accordion";
import { badge } from "./badge";
import { button } from "./button";
import { list } from "./list";
import { minecraftItem } from "./minecraft-item";
import { playerAvatar } from "./player-avatar";
import { playerPhraseCard } from "./player-phrase-card";
import { skinViewer } from "./skin-viewer";

// 単一要素のレシピ
export const recipes = {
    button,
    badge,
    skinViewer,
};

// 複数スロットを持つレシピ
export const slotRecipes = {
    playerAvatar,
    playerPhraseCard,
    list,
    accordion,
    minecraftItem,
};
