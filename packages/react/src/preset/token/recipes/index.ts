import { accordion } from "./accordion";
import { button } from "./button";
import { list } from "./list";
import { playerPhraseCard } from "./player-phrase-card";

// 単一要素のレシピ
export const recipes = {
    button,
};

// 複数スロットを持つレシピ
export const slotRecipes = {
    playerPhraseCard,
    list,
    accordion,
};
