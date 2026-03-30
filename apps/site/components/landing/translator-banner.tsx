"use client";

import { Languages, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { translationCollabUrl } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const SCROLL_HIDE_PX = 120;

export function TranslatorBanner() {
  const [revealed, setRevealed] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    const handleScroll = () => {
      setRevealed(window.scrollY < SCROLL_HIDE_PX);
    };

    // Small delay to ensure the pop-out animation is visible on initial load
    const timer = setTimeout(() => {
      handleScroll();
    }, 150);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <div className="pointer-events-none fixed top-1/2 right-0 z-[60] -translate-y-1/2">
      <aside
        aria-label="Kaneo is looking for translators"
        aria-hidden={!revealed}
        className={cn(
          "pointer-events-none max-w-[min(calc(100vw-0.75rem),19rem)] transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
          revealed
            ? "translate-x-0 opacity-100"
            : "translate-x-[calc(100%+12px)] opacity-0",
        )}
      >
        <div
          className={cn(
            "relative origin-right -skew-x-[5deg] rounded-l-2xl border border-border/80 border-r-0 bg-background/95 py-3 pr-3 pl-4 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.14)] backdrop-blur-md motion-reduce:-skew-x-0 dark:shadow-[0_8px_32px_-12px_rgba(0,0,0,0.45)]",
            revealed ? "pointer-events-auto" : "pointer-events-none",
          )}
        >
          <div className="skew-x-[5deg] motion-reduce:skew-x-0">
            <Button
              size="icon-xs"
              variant="ghost"
              className="absolute -top-1.5 -right-1.5 z-10 h-6 w-6 rounded-full bg-background/50 text-muted-foreground shadow-sm hover:bg-accent hover:text-foreground"
              onClick={() => {
                setRevealed(false);
                setTimeout(() => setDismissed(true), 500);
              }}
              aria-label="Dismiss"
            >
              <X className="h-3 w-3" />
            </Button>
            <div className="flex flex-col gap-2.5">
              <p className="flex items-start gap-2 pr-2 text-balance text-foreground text-sm leading-snug">
                <Languages
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  aria-hidden
                />
                <span>
                  <span className="font-medium">
                    We&apos;re looking for translators
                  </span>
                  <span className="text-muted-foreground">
                    {" "}
                    — help bring Kaneo to more languages.
                  </span>
                </span>
              </p>
              <a
                className={cn(
                  buttonVariants({ size: "sm", variant: "outline" }),
                  "w-full border-primary/25 bg-background/90 text-center shadow-xs/5 hover:bg-accent sm:w-auto sm:self-end",
                )}
                href={translationCollabUrl}
                rel="noopener noreferrer"
                tabIndex={revealed ? undefined : -1}
                target="_blank"
              >
                Translation project
              </a>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
