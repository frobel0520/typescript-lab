/** Resolves public assets under both a local root and a GitHub Pages project path. */
export function assetUrl(path: string): string {
  return new URL(
    import.meta.env.BASE_URL + path.replace(/^\//, ''),
    window.location.origin,
  ).href;
}
