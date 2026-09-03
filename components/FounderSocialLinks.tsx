import { Camera, Music2, Play, Share2 } from "lucide-react";

import styles from "./FounderSocialLinks.module.css";

const profiles = [
  { label: "YouTube", handle: "@sandeepcanadalife", href: "https://www.youtube.com/@sandeepcanadalife", icon: Play },
  { label: "Instagram", handle: "@sandeepcanadalife", href: "https://www.instagram.com/sandeepcanadalife/", icon: Camera },
  { label: "TikTok", handle: "@sandeepcanadalife", href: "https://www.tiktok.com/@sandeepcanadalife", icon: Music2 },
  { label: "Facebook", handle: "Sandeep Canada Life", href: "https://www.facebook.com/sandeepcanadalife/", icon: Share2 },
];

export default function FounderSocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`${styles.socials} ${className}`} aria-label="Sandeep Canada Life social profiles">
      {profiles.map(({ label, handle, href, icon: Icon }) => (
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label}: ${handle}`}>
          <Icon size={17} aria-hidden="true" />
          <span><strong>{label}</strong><small>{handle}</small></span>
        </a>
      ))}
    </div>
  );
}
