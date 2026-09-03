import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle } from "lucide-react";
import type { ReactNode } from "react";

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
    <div className="min-h-screen bg-background font-body">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            S&amp;S
          </span>
          <span className="hidden text-sm font-semibold sm:block">
            S&amp;S Tech Solutions Hub
            <span className="block text-[11px] font-normal text-muted-foreground">
              web · design · development
            </span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "text-primary" }}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Button asChild size="sm" className="rounded-full">
          <Link to="/contact">
            Get a Quote <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border bg-ink">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              S&amp;S
            </span>
            <span className="font-sans font-semibold">S&amp;S Tech Solutions Hub</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            web · design · development · digital solutions
          </p>
          <Button asChild size="sm" variant="outline" className="mt-5 rounded-full">
            <a href={waLink(generalMessage())} target="_blank" rel="noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp us
            </a>
          </Button>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Quick links</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Contact</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <a
                href={waLink(generalMessage(), WHATSAPP_PRIMARY)}
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary"
              >
                +254 713 268806
              </a>
            </li>
            <li>
              <a
                href={waLink(generalMessage(), WHATSAPP_SECONDARY)}
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary"
              >
                +254 115 323 604
              </a>
            </li>
            <li>
              <a href={`mailto:${EMAIL}`} className="hover:text-primary">
                {EMAIL}
              </a>
            </li>
            <li>Nairobi CBD &amp; Westlands, Kenya</li>
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Admin</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/admin" className="hover:text-primary">
                Portfolio manager
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} S&amp;S Tech Solutions Hub. Building brands, one design at a time.
      </div>
    </footer>
  );
}
