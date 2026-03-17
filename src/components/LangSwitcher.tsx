import { useLang } from "@/hooks/useLang";
import type { Lang } from "@/hooks/useLang";
import s from "@/styles/LangSwitcher.module.css";

const LANGS: { value: Lang; label: string }[] = [
  { value: "fr", label: "FR" },
  { value: "en", label: "EN" },
];

export function LangSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <div className={s.wrap}>
      {LANGS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setLang(value)}
          className={`${s.btn} ${lang === value ? s.active : ""}`}
          aria-label={`Switch to ${label}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
