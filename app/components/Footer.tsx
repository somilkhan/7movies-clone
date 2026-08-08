export function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div>
        <span>© 2026 7MOVIES</span>
        <span className="hidden sm:inline"> · MADE FOR THE AFTER HOURS</span>
      </div>
      <nav aria-label="Footer navigation">
        <a href="/privacy" className="hover:text-white transition-colors">PRIVACY</a>
        <span className="mx-2">·</span>
        <a href="/terms" className="hover:text-white transition-colors">TERMS</a>
      </nav>
    </footer>
  )
}
