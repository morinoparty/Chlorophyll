import { accordion } from "./accordion";
import { avatar } from "./avatar";
import { badge } from "./badge";
import { breadcrumb } from "./breadcrumb";
import { button } from "./button";
import { checkbox } from "./checkbox";
import { dialog } from "./dialog";
import { card } from "./card";
import { drawer } from "./drawer";
import { editable } from "./editable";
import { field } from "./field";
import { guideCard } from "./guide-card";
import { iconButton } from "./icon-button";
import { list } from "./list";
import { menu } from "./menu";
import { minecraftItem } from "./minecraft-item";
import { modalDialog } from "./modal-dialog";
import { newsCard } from "./news-card";
import { pagination } from "./pagination";
import { playerAvatar } from "./player-avatar";
import { playerCard } from "./player-card";
import { playerMap } from "./player-map";
import { playerPhraseCard } from "./player-phrase-card";
import { radioGroup } from "./radio-group";
import { segmentGroup } from "./segment-group";
import { select } from "./select";
import { separator } from "./separator";
import { skeleton } from "./skeleton";
import { skinViewer } from "./skin-viewer";
import { spinner } from "./spinner";
import { switchRecipe } from "./switch";
import { table } from "./table";
import { tabs } from "./tabs";
import { toast } from "./toast";
import { tooltip } from "./tooltip";

// 単一要素のレシピ
export const recipes = {
    button,
    badge,
    iconButton,
    skinViewer,
    spinner,
    skeleton,
    separator,
};

// 複数スロットを持つレシピ
export const slotRecipes = {
    playerAvatar,
    playerMap,
    playerPhraseCard,
    list,
    accordion,
    avatar,
    minecraftItem,
    guideCard,
    newsCard,
    menu,
    dialog,
    drawer,
    editable,
    field,
    modalDialog,
    pagination,
    radioGroup,
    segmentGroup,
    select,
    // `switch` は予約語で styled-system/recipes の export 名にできないため、キーは switchRecipe にする
    switchRecipe,
    breadcrumb,
    checkbox,
    table,
    tabs,
    toast,
    tooltip,
    card,
    playerCard,
};
