// Helpers that turn the website array into what the dashboard shows:
// options, searching, filtering, sorting, pagination and the statistics.

export const PAGE_SIZE = 5;

export const TYPE_OPTIONS = [
  { value: "leads", label: "Leads" },
  { value: "none_leads", label: "None Leads" },
];

export const STATUS_OPTIONS = [
  { value: "untested", label: "Untested" },
  { value: "working", label: "Working" },
  { value: "not_working", label: "Not Working" },
  { value: "broken", label: "Broken" },
];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest Added" },
  { value: "oldest", label: "Oldest Added" },
  { value: "website-asc", label: "Website A-Z" },
  { value: "website-desc", label: "Website Z-A" },
  { value: "tested-recent", label: "Recently Tested" },
  { value: "tested-old", label: "Oldest Tested" },
  { value: "status", label: "Status" },
];

// The order used when sorting by status.
const STATUS_ORDER = ["working", "not_working", "broken", "untested"];

// Search (website, tester, notes), type filter and status filter work together.
export function filterWebsites(
  websites,
  { search = "", type = "", status = "" } = {}
) {
  const term = String(search || "").trim().toLowerCase();

  return websites.filter((website) => {
    const matchesSearch =
      !term ||
      [website.website, website.tester, website.notes].some((value) =>
        String(value || "").toLowerCase().includes(term)
      );

    const matchesType = !type || website.type === type;
    const matchesStatus = !status || website.status === status;

    return matchesSearch && matchesType && matchesStatus;
  });
}

// Returns a new sorted array, the original array is never changed.
export function sortWebsites(websites, sortBy = "newest") {
  const sorted = [...websites];

  const time = (value) => (value ? new Date(value).getTime() : 0);

  switch (sortBy) {
    case "oldest":
      return sorted.sort((a, b) => time(a.createdAt) - time(b.createdAt));

    case "website-asc":
      return sorted.sort((a, b) => a.website.localeCompare(b.website));

    case "website-desc":
      return sorted.sort((a, b) => b.website.localeCompare(a.website));

    case "tested-recent":
      return sorted.sort((a, b) => time(b.lastTested) - time(a.lastTested));

    case "tested-old":
      return sorted.sort((a, b) => time(a.lastTested) - time(b.lastTested));

    case "status":
      return sorted.sort(
        (a, b) =>
          STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status)
      );

    case "newest":
    default:
      return sorted.sort((a, b) => time(b.createdAt) - time(a.createdAt));
  }
}

// Splits the list into pages. The page number is clamped, so it is always
// valid even after filtering.
export function paginate(items, page = 1, perPage = PAGE_SIZE) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (currentPage - 1) * perPage;
  const pageItems = items.slice(startIndex, startIndex + perPage);

  return {
    items: pageItems,
    currentPage,
    totalPages,
    total,
    start: total === 0 ? 0 : startIndex + 1,
    end: startIndex + pageItems.length,
  };
}

// Every dashboard count is calculated from the website array.
export function calculateStats(websites) {
  const countBy = (field, value) =>
    websites.filter((website) => website[field] === value).length;

  return {
    total: websites.length,
    working: countBy("status", "working"),
    notWorking: countBy("status", "not_working"),
    broken: countBy("status", "broken"),
    untested: countBy("status", "untested"),
    leads: countBy("type", "leads"),
    noneLeads: countBy("type", "none_leads"),
  };
}
