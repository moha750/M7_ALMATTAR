import { Mail } from "lucide-react";

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** أيقونات الحسابات — مرسومة يدويًّا بخط واحد لتتسق مع بقية الأيقونات. */
export function SocialIcon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  switch (name) {
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...S}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.3" cy="6.7" r=".6" fill="currentColor" />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...S}>
          <path d="M4 4l16 16M20 4L4 20" />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...S}>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M8 10.5V16M8 7.8v.01M12 16v-5.5M12 13a2.5 2.5 0 0 1 5 0v3" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...S}>
          <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
          <path d="M10.5 9.5l4 2.5-4 2.5z" fill="currentColor" />
        </svg>
      );
    case "behance":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...S}>
          <path d="M3 7h5a2.5 2.5 0 0 1 0 5H3zM3 12h5.5a2.75 2.75 0 0 1 0 5.5H3z" />
          <path d="M14.5 14.3h6.5a3.3 3.3 0 1 0-1 2.4M15 8h4.5" />
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...S}>
          <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" />
          <path d="M14 3c.4 2.6 2.2 4.4 5 4.6" />
        </svg>
      );
    case "email":
      return <Mail className={className} strokeWidth={1.8} aria-hidden />;
    default:
      return null;
  }
}
