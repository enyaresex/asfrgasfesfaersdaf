export function createGtag({ category, event, label, value }: AnalyticsEvent): string {
  return JSON.stringify({ category, event, label, value });
}

export function sendEcommerceEvent({ currencyCode, event, transactionId, transactionTotal }: AnalyticsEcommerceEvent) {
  window.dataLayer.push({ currencyCode, event: event || 'purchase', transactionId, transactionTotal });
}

export function sendGAEvent({ category, event, label, value }: AnalyticsEvent) {
  window.dataLayer.push({ category, event, label, value });
}

export function listenGtmEvents(e: Event) {
  const trackedElement: HTMLAnchorElement | HTMLButtonElement | null = (e.target as HTMLElement).closest(
    '[data-gtag]',
  );

  if (trackedElement !== null) {
    const { gtag } = trackedElement.dataset;

    if (gtag) {
      sendGAEvent({ ...JSON.parse(gtag) });
    }
  }
}
