import Link from "next/link";

const companyLinks = [
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Careers", href: "/careers" },
];

const productLinks = [
  { name: "Products", href: "/products" },
  { name: "Synqo Reminder", href: "/products/reminder" },
  { name: "AI Employee", href: "/products/ai-employee" },
];

const businessLinks = [
  { name: "Services", href: "/services" },
  { name: "Pricing", href: "/pricing" },
  { name: "Book a Call", href: "/contact" },
];

const legalLinks = [
  { name: "Privacy", href: "/privacy" },
  { name: "Terms", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-grid">
        <div className="site-footer-brand">
          <Link className="brand" href="/">
            <span className="brand-mark">S</span>

            <span className="brand-text">
              SYNQO <strong>AI</strong>
            </span>
          </Link>

          <p>
            Practical AI software, automation and SaaS products built for modern
            businesses.
          </p>

          <a className="footer-email" href="mailto:hello.synqoai@gmail.com">
            hello.synqoai@gmail.com
          </a>
        </div>

        <div className="footer-column">
          <h3>Company</h3>

          {companyLinks.map((link) => (
            <Link key={link.name} href={link.href}>
              {link.name}
            </Link>
          ))}
        </div>

        <div className="footer-column">
          <h3>Products</h3>

          {productLinks.map((link) => (
            <Link key={link.name} href={link.href}>
              {link.name}
            </Link>
          ))}
        </div>

        <div className="footer-column">
          <h3>Business</h3>

          {businessLinks.map((link) => (
            <Link key={link.name} href={link.href}>
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="site-footer-bottom">
        <small>© 2026 Synqo AI. All rights reserved.</small>

        <div>
          {legalLinks.map((link) => (
            <Link key={link.name} href={link.href}>
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
