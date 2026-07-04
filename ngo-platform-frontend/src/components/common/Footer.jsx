export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-borderc mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 text-center text-sm text-muted">
        <p>Copyright {year} NGO Coordination Platform. Built for transparent, coordinated relief.</p>
      </div>
    </footer>
  );
}