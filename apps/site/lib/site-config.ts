/**
 * Public URLs for the marketing site. Override via env when deploying
 * (e.g. set NEXT_PUBLIC_TRANSLATION_COLLAB_URL to your Crowdin or Tolgee project).
 */
export const translationCollabUrl =
  process.env.NEXT_PUBLIC_TRANSLATION_COLLAB_URL ??
  "https://github.com/usekaneo/kaneo/blob/main/CONTRIBUTING.md#localization-i18n";
