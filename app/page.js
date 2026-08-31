import Link from "next/link";

export default function Home() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "3rem", maxWidth: 560, margin: "0 auto" }}>
      <h1>hello-api</h1>
      <p style={{ color: "#666" }}>Next.js + MongoDB assignment.</p>
      <ul style={{ lineHeight: 2 }}>
        <li><Link href="/items">Items page</Link> — add / soft-delete items (frontend)</li>
        <li><a href="/api/items">/api/items</a> — list active items (JSON)</li>
        <li><a href="/api/testing">/api/testing</a> — Next JS 3 testing API (JSON)</li>
      </ul>
    </main>
  );
}
