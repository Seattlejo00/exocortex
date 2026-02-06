export default function Footer() {
  return (
    <footer className="border-t border-white/[0.04] py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-text-muted text-xs">
        <div className="flex items-center gap-1.5">
          <span>A</span>
          <a
            href="https://distomostech.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-secondary transition-colors underline underline-offset-2"
          >
            Distomos LLC
          </a>
          <span>product</span>
        </div>

        <span>&copy; {new Date().getFullYear()} Distomos LLC. All rights reserved.</span>
      </div>
    </footer>
  );
}
