import { useTranslation } from "react-i18next";
import { useCallback } from "react";

export type Lang = "fr" | "en";

export function useLang() {
  const { i18n } = useTranslation();

  const lang = i18n.language as Lang;

  const setLang = useCallback((l: Lang) => {
    i18n.changeLanguage(l);
    localStorage.setItem("ssv_lang", l);
  }, [i18n]);

  return { lang, setLang };
}
