"use client";

import { useEffect, useState } from "react";

// Same-origin: the API lives in this same Next app, so no host needed.
export default function ItemsPage() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadItems() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/items");
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function addItem(e) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error(`Create failed: ${res.status}`);
      setName("");
      loadItems();
    } catch (err) {
      setError(err.message);
    }
  }

  // Soft delete: DELETE sets status to "DELETED" on the server (document is kept).
  async function deleteItem(id) {
    try {
      const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      loadItems(); // item leaves the list because GET hides DELETED
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", maxWidth: 560, margin: "0 auto" }}>
      <h1>Items</h1>
      <p style={{ color: "#666" }}>
        Add items, then Delete one. Delete is a <b>soft delete</b> — the document
        stays in MongoDB with <code>status: "DELETED"</code> and just disappears
        from this list.
      </p>

      <form onSubmit={addItem} style={{ display: "flex", gap: "0.5rem", margin: "1.5rem 0" }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New item name"
          style={{ flex: 1, padding: "0.6rem", borderRadius: 6, border: "1px solid #ccc" }}
        />
        <button type="submit" style={{ padding: "0.6rem 1.2rem", borderRadius: 6, cursor: "pointer" }}>
          Add
        </button>
      </form>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}
      {!loading && !error && items.length === 0 && <p>No items yet.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((it) => (
          <li
            key={it._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.6rem 0.9rem",
              border: "1px solid #e2e2e2",
              borderRadius: 8,
              marginBottom: "0.5rem",
            }}
          >
            <span>
              {it.name} <small style={{ color: "#999" }}>({it.status})</small>
            </span>
            <button
              onClick={() => deleteItem(it._id)}
              style={{ padding: "0.4rem 0.9rem", borderRadius: 6, cursor: "pointer" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
