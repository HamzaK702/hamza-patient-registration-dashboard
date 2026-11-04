"use client";

/**
 * Flips between light (default) and dark and remembers the choice. Which icon
 * shows is decided by CSS from the current theme, so there is nothing to
 * hydrate differently.
 */
export function ThemeToggle({
  className = "border-line bg-surface text-ink-soft hover:border-brand hover:text-brand",
}: { className?: string }) {
  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    if (next === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Private mode or blocked storage: the switch still works for this visit.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${className}`}
    >
      <span className="show-in-light items-center" title="Switch to dark mode">
        <span className="sr-only">Switch to dark mode</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      </span>
      <span className="show-in-dark items-center" title="Switch to light mode">
        <span className="sr-only">Switch to light mode</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      </span>
    </button>
  );
}
