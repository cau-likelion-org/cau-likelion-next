const GA_KEY: string | any = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

export const pageview = (url: URL) => {
  window.gtag('config', GA_KEY, {
    page_path: url,
  });
};

interface GTagEvent {
  action: string;
  category?: string;
  label?: string;
  value?: string;
}

export const event = ({ action, category, label, value }: GTagEvent) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
