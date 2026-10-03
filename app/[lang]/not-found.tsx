import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ minHeight: "100svh", display: "grid", placeItems: "center", textAlign: "center", padding: 24, background: "var(--night)", color: "#fff" }}>
      <div>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "4rem", color: "var(--sand)" }}>404</p>
        <p style={{ margin: "8px 0 24px", opacity: 0.8 }}>This page doesn&apos;t exist.</p>
        <Link className="btn btn-primary" href="/">Back to Leley Camp</Link>
      </div>
    </main>
  );
}
