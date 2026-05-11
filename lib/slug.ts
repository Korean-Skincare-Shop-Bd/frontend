const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const getSlugValidationError = (slug?: string) => {
  const value = slug?.trim();

  if (!value) return null;

  if (!SLUG_PATTERN.test(value)) {
    return "Slug must use lowercase letters or numbers separated by single hyphens, and cannot start or end with a hyphen.";
  }

  return null;
};
