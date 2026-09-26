import { Link } from "@tanstack/react-router";
import { ArrowRight, Mail, MessageCircle, Menu, Phone, X } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { NAV } from "@/lib/content";
import { EMAIL } from "@/lib/site";
import {
  WHATSAPP_PRIMARY,
  WHATSAPP_SECONDARY,
  generalMessage,
  waLink,
} from "@/lib/whatsapp";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-hidden bg-background font-body">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <a
        href={waLink(generalMessage())}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform duration-300 hover:-translate-y-1"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}

function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link to="/" onClick={() => setOpen(false)}>
          <Logo size={36} />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
              activeProps={{ className: "text-sm font-medium text-primary" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden rounded-none px-5 sm:inline-flex">
            <Link to="/contact">
              Get started <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-none border border-border text-foreground lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-background px-4 py-4 lg:hidden">
          <ul className="space-y-1">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button asChild className="mt-3 w-full rounded-none">
            <Link to="/contact" onClick={() => setOpen(false)}>
              Get started
            </Link>
          </Button>
        </nav>
      )}
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border bg-ink text-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:grid-cols-2 md:px-8 lg:grid-cols-4">
        <div>
          <Logo size={40} tone="inverted" />
          <p className="mt-4 max-w-xs text-sm text-background/70">
            Technology, digital, branding and business solutions for modern businesses and
            professionals.
          </p>
          <Button asChild size="sm" className="mt-5 rounded-none">
            <a href={waLink(generalMessage())} target="_blank" rel="noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp us
            </a>
          </Button>
        </div>

        <div>
          <h2 className="font-sans text-sm font-semibold text-background">Explore</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-background/70 transition-colors hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/church-poster-design"
                className="text-background/70 transition-colors hover:text-accent"
              >
                Church poster design
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-sans text-sm font-semibold text-background">Contact</h2>
          <ul className="mt-3 space-y-2 text-sm text-background/70">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-accent" />
              <a href={waLink(generalMessage(), WHATSAPP_PRIMARY)} target="_blank" rel="noreferrer" className="hover:text-accent">
                +254 101 106 243
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-accent" />
              <a href={waLink(generalMessage(), WHATSAPP_SECONDARY)} target="_blank" rel="noreferrer" className="hover:text-accent">
                +254 115 323 604
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-accent" />
              <a href={`mailto:${EMAIL}`} className="hover:text-accent">
                {EMAIL}
              </a>
            </li>
            <li>Nairobi CBD &amp; Westlands, Kenya</li>
          </ul>
        </div>

        <div>
          <h2 className="font-sans text-sm font-semibold text-background">Private area</h2>
          <ul className="mt-3 space-y-2 text-sm text-background/70">
            <li>
              <Link to="/admin" className="hover:text-accent">
                Portfolio manager
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-background/15 py-6 text-center text-xs text-background/60">
        © {new Date().getFullYear()} S&amp;S Business Solutions. Build. Brand. Digitize. Grow.
      </div>
    </footer>
  );
}
