"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            fontFamily: "system-ui, sans-serif",
            textAlign: "center",
            padding: "1rem",
          }}
        >
          <h1 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            Oops!
          </h1>
          <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "1.5rem" }}>
            Something went wrong. Please try again.
          </p>
          {error.digest && (
            <p style={{ fontSize: "0.75rem", color: "#999", marginBottom: "1.5rem" }}>
              Error ID: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            style={{
              background: "#2563eb",
              color: "#fff",
              fontWeight: 600,
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
