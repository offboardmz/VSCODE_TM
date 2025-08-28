import { APP_TEXTS_EN } from "@/src/constants/texts.en";

const LANGS = {
  en: APP_TEXTS_EN,
};

export type LangKey = keyof typeof LANGS;

let currentLang: LangKey = "en";

export function setLang(lang: LangKey) {
  currentLang = lang;
}

export function text() {
  return LANGS[currentLang];
}