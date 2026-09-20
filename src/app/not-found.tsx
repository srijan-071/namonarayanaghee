import Link from "next/link";

export default function NotFound() {
  return (
    <section className="nn-section bg-white min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="font-serif text-6xl font-bold text-nn-forest">404</h1>
        <h2 className="nn-title">Page Not Found</h2>
        <p className="nn-sub">The page you are looking for does not exist or has been moved.</p>
        <Link href="/" className="nn-btn nn-btn-primary mt-4">Go Home</Link>
      </div>
    </section>
  );
}
