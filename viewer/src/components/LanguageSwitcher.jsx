import { useLingoContext } from "@lingo.dev/compiler/react";

export default function LanguageSwitcher({ availableLanguages }) {
  const { locale, setLocale } = useLingoContext();

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="language-select" className="text-sm text-gray-600">
        Language:
      </label>
      <select
        id="language-select"
        value={locale}
        onChange={(e) => setLocale(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {availableLanguages.map((lang) => (
          <option key={lang} value={lang}>
            {lang.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
