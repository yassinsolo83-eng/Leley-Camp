import Link from "next/link";

// Shown inside the site layout (header and footer stay). Kept in English because
// Next.js doesn't pass the language to this file.
export default function NotFound() {
  return (
    <section className="not-found">
      <div className="container">
        <p className="display not-found-code">404</p>
        <p>This page doesn&apos;t exist.</p>
        <Link className="btn btn-red" href="/">Back to home</Link>
      </div>
    </section>
  );
}
