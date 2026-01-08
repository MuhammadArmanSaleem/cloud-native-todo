"use client";

import { useLanguage } from "../../contexts/LanguageContext";
import { Language } from "../../content/uiCopy";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => handleLanguageChange("en")}
        className={`px-3 py-1.5 text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background ${
          language === "en"
            ? "bg-primary text-primary-foreground"
            : "bg-card text-foreground hover:bg-muted border border-border"
        }`}
        aria-label="Switch to English"
        aria-pressed={language === "en"}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => handleLanguageChange("ur")}
        className={`px-3 py-1.5 text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background ${
          language === "ur"
            ? "bg-primary text-primary-foreground"
            : "bg-card text-foreground hover:bg-muted border border-border"
        }`}
        aria-label="Switch to Urdu"
        aria-pressed={language === "ur"}
      >
        اردو
      </button>
    </div>
  );
}


