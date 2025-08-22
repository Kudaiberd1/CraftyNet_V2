function formatDates(dateString: string | undefined) {
  if (dateString === undefined) return;
  return dateString.split(",").map((date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  );
}

export default formatDates;
// ["Jan 1, 2010", "Dec 31, 2018", "Jan 1, 1960", "Dec 31, 1969"]

export function getSiteName(url: string): string | null {
  try {
    const parsed = new URL(url); // built-in URL parser
    const domain = parsed.hostname; // e.g. "github.com"
    const parts = domain.split("."); // ["github", "com"]

    if (parts.length >= 2) {
      return parts[parts.length - 2]; // "github"
    }
    return domain;
  } catch (e) {
    return null; // invalid URL
  }
}
