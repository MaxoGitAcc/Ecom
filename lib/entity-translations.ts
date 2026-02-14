import type { LocalizedText, EntityTranslations } from "@/types/product";

/**
 * Get a translated field value for the given language, falling back to the raw value.
 */
export function getTranslatedField(
  translations: EntityTranslations | undefined,
  field: string,
  lang: string,
  fallback: string,
): string {
  const langFields = translations?.[lang];
  if (!langFields) return fallback;

  const value =
    langFields[field] ??
    Object.entries(langFields).find(([k]) => k.toLowerCase() === field.toLowerCase())?.[1];

  return value || fallback;
}

/**
 * Convert API translations format to LocalizedText for a specific field.
 * e.g. { "en": { "Name": "Hello" }, "ka": { "Name": "გამარჯობა" } } + "Name"
 *   => { en: "Hello", ka: "გამარჯობა" }
 */
export function entityTranslationsToLocalized(
  translations: EntityTranslations | undefined,
  field: string,
): LocalizedText {
  const result: Record<string, string> = { en: "" };

  if (!translations) return result as LocalizedText;

  const fieldLower = field.toLowerCase();

  for (const [lang, fields] of Object.entries(translations)) {
    // Try exact match first, then case-insensitive match
    // (handles backend camelCase serialization of dictionary keys)
    const value =
      fields[field] ??
      Object.entries(fields).find(([k]) => k.toLowerCase() === fieldLower)?.[1];

    if (value !== undefined) {
      result[lang] = value;
    }
  }

  return result as LocalizedText;
}

/**
 * Convert multiple LocalizedText fields back to API translations format.
 * e.g. { Name: { en: "Hello", ka: "გამარჯობა" }, Description: { en: "Desc", ka: "აღწერა" } }
 *   => { "en": { "Name": "Hello", "Description": "Desc" }, "ka": { "Name": "გამარჯობა", "Description": "აღწერა" } }
 */
export function localizedToEntityTranslations(
  fields: Record<string, LocalizedText>,
): EntityTranslations {
  const result: EntityTranslations = {};

  for (const [fieldName, localizedText] of Object.entries(fields)) {
    for (const [lang, value] of Object.entries(localizedText)) {
      if (!result[lang]) result[lang] = {};
      if (value) {
        result[lang][fieldName] = value;
      }
    }
  }

  return result;
}
