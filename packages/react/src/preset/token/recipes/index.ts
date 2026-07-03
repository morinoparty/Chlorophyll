import { accordion } from "./accordion";
import { badge } from "./badge";
import { button } from "./button";
import { list } from "./list";
import { playerPhraseCard } from "./player-phrase-card";

// 単一要素のレシピ
export const recipes = {
    button,
    badge,
};

// 複数スロットを持つレシピ
export const slotRecipes = {
    playerPhraseCard,
    list,
    accordion,
};
