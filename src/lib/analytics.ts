// Analytics abstraction layer
// Add providers here without touching every component

type EventName =
  | "page_view"
  | "view_item"
  | "add_to_cart"
  | "remove_from_cart"
  | "begin_checkout"
  | "purchase";

interface AnalyticsPayload {
  [key: string]: unknown;
}

const providers: Array<(event: EventName, payload: AnalyticsPayload) => void> = [];

export function registerProvider(
  fn: (event: EventName, payload: AnalyticsPayload) => void
) {
  providers.push(fn);
}

export function track(event: EventName, payload: AnalyticsPayload = {}) {
  for (const fn of providers) {
    try {
      fn(event, payload);
    } catch {
      // silently ignore provider errors
    }
  }
}
