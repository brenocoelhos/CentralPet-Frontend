import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const HORIZONTAL_PADDING = 14;
export const CARD_GAP = 10;
export const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;
export const CARD_HEIGHT = 272;
export const CARD_IMAGE_HEIGHT = 180;
