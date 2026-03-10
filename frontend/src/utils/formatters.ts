/**
 * Formatting utilities for dates, currency, and contract fields.
 */

/**
 * Format an ISO date string into a human-readable form.
 */
export function formatDate(
  isoString: string | null | undefined,
  options?: Intl.DateTimeFormatOptions,
): string {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "Invalid date";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  });
}

/**
 * Format a datetime string to include time.
 */
export function formatDateTime(isoString: string | null | undefined): string {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "Invalid date";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format a currency value with symbol and thousands separators.
 */
export function formatCurrency(
  value: string | number | null | undefined,
  currency: string = "USD",
): string {
  if (value === null || value === undefined) return "N/A";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Map a contract status string to a human-readable label.
 */
const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  pending_approval: "Pending Approval",
  approved: "Approved",
  rejected: "Rejected",
  pending_signature: "Pending Signature",
  active: "Active",
  expired: "Expired",
  terminated: "Terminated",
  renewed: "Renewed",
  archived: "Archived",
};

export function getStatusLabel(status: string): string {
  return STATUS_LABELS[status] || status;
}

/**
 * Map a contract status to a CSS colour class for badges.
 */
const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  pending_approval: "bg-yellow-100 text-yellow-800",
  approved: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
  pending_signature: "bg-purple-100 text-purple-800",
  active: "bg-green-100 text-green-800",
  expired: "bg-orange-100 text-orange-800",
  terminated: "bg-red-100 text-red-800",
  renewed: "bg-teal-100 text-teal-800",
  archived: "bg-gray-200 text-gray-600",
};

export function getStatusColor(status: string): string {
  return STATUS_COLORS[status] || "bg-gray-100 text-gray-800";
}

/**
 * Map a priority value to a human-readable label.
 */
const PRIORITY_LABELS: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

export function getPriorityLabel(priority: string): string {
  return PRIORITY_LABELS[priority] || priority;
}

/**
 * Calculate days remaining until a given date.
 */
export function daysUntil(dateString: string | null | undefined): number | null {
  if (!dateString) return null;
  const target = new Date(dateString);
  if (isNaN(target.getTime())) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Truncate a string to a maximum length, appending "..." if needed.
 */
export function truncate(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}
