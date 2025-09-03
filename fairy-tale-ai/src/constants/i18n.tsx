import { APP_TEXTS_EN } from "@/src/constants/texts.en";
import { APP_TEXTS_RU } from "@/src/constants/texts.ru";
import { APP_TEXTS_RU_SLANG } from "@/src/constants/texts.ru.slang";
import { APP_TEXTS_RU_AGRESS } from "@/src/constants/texts.ru.agress";

const LANGS = {
  en: APP_TEXTS_EN,
  rudef: APP_TEXTS_RU,
  ruslg: APP_TEXTS_RU_SLANG,
  ru: APP_TEXTS_RU_AGRESS,
};

export type LangKey = keyof typeof LANGS;

let currentLang: LangKey = "en";

export function setLang(lang: LangKey) {
  currentLang = lang;
}

export function text() {
  return LANGS[currentLang];
}