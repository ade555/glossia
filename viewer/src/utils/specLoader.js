import SwaggerParser from "@apidevtools/swagger-parser";
import yaml from "js-yaml";

/**
 * Load the index to see what specs are available
 */
export async function getSpecIndex() {
  const response = await fetch("/trans-spec/index.json");
  return await response.json();
}

/**
 * Get browser's language preference
 */
export function getBrowserLanguage() {
  // navigator.language returns like "en-US", "es-ES", etc.
  const lang = navigator.language.split("-")[0]; // Get just "en", "es", etc.
  return lang;
}

/**
 * Load and parse the i18n.json config to get available languages
 */
export async function getAvailableLanguages() {
  try {
    const response = await fetch("/trans-spec/i18n.json");
    const config = await response.json();

    return {
      source: config.locale.source,
      targets: config.locale.targets,
      all: [config.locale.source, ...config.locale.targets],
    };
  } catch (err) {
    console.error("Failed to load i18n config:", err);
    return { source: "en", targets: [], all: ["en"] };
  }
}

/**
 * Get default language based on browser preference
 */
export async function getDefaultLanguage() {
  const browserLang = getBrowserLanguage();
  const { all, source } = await getAvailableLanguages();

  // Use browser language if available, otherwise fallback to source
  return all.includes(browserLang) ? browserLang : source;
}

/**
 * Get default spec (first one alphabetically)
 */
export async function getDefaultSpec() {
  const index = await getSpecIndex();
  const defaultLang = await getDefaultLanguage();
  const specs = index[defaultLang] || [];

  return specs[0] || null;
}

/**
 * Load and parse an OpenAPI spec for a specific language and filename
 */
export async function loadSpec(language, filename) {
  try {
    const response = await fetch(`/trans-spec/i18n/${language}/${filename}`);
    const yamlText = await response.text();
    const parsed = yaml.load(yamlText);

    // Dereference all $refs for easier rendering
    const dereferenced = await SwaggerParser.dereference(parsed);

    return dereferenced;
  } catch (err) {
    console.error(`Failed to load spec ${filename} for ${language}:`, err);
    throw err;
  }
}
