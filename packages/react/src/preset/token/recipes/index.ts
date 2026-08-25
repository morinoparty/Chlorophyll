import { accordion } from "./accordion";
import { badge } from "./badge";
import { button } from "./button";
import { drawer } from "./drawer";
import { editable } from "./editable";
import { guideCard } from "./guide-card";
import { list } from "./list";
import { menu } from "./menu";
import { minecraftItem } from "./minecraft-item";
import { modalDialog } from "./modal-dialog";
import { newsCard } from "./news-card";
import { pagination } from "./pagination";
import { playerAvatar } from "./player-avatar";
import { playerMap } from "./player-map";
import { playerPhraseCard } from "./player-phrase-card";
import { select } from "./select";
import { skeleton } from "./skeleton";
import { skinViewer } from "./skin-viewer";
import { spinner } from "./spinner";
import { toast } from "./toast";
import { tooltip } from "./tooltip";

// 単一要素のレシピ
export const recipes = {
    button,
    badge,
    skinViewer,
    spinner,
    skeleton,
};

// 複数スロットを持つレシピ
export const slotRecipes = {
    playerAvatar,
    playerMap,
    playerPhraseCard,
    list,
    accordion,
    minecraftItem,
    guideCard,
    newsCard,
    menu,
    drawer,
    editable,
    modalDialog,
    pagination,
    select,
    toast,
    tooltip,
};
