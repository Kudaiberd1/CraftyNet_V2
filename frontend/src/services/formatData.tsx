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

export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  // Get hours and minutes
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
}

export function calculateDate(dateString: string): number {
  const date = new Date(dateString);

  // Get hours and minutes
  const year = date.getFullYear.toString().padStart(2, "0");
  const month = date.getMonth().toString().padStart(2, "0");
  const day = date.getDay().toString().padStart(2, "0");

  return Number(year) + Number(month) + Number(day);
}
