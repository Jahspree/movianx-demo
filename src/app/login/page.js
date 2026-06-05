import Link from "next/link";
import TrackedLink from "../TrackedLink";

export const metadata = {
  title: "Login - Movianx",
  description: "Viewer access for Movianx immersive entertainment.",
};

export default function LoginPage() {
  return (
    <main
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        color: "#fff",
        background:
          "radial-gradient(circle at 50% 0%, rgba(165, 33, 33, 0.28), transparent 34%), linear-gradient(135deg, #050507 0%, #101014 58%, #170808 100%)",
        fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <section
        style={{
          width: "min(520px, 100%)",
          padding: "34px 28px",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 18,
          background: "rgba(255,255,255,0.06)",
          boxShadow: "0 34px 120px rgba(0,0,0,0.42)",
        }}
      >
        <p
          style={{
            margin: "0 0 12px",
            color: "rgba(255,255,255,0.62)",
            fontSize: 12,
            fontWeight: 800,
            textTransform: "uppercase",
          }}
        >
          Viewer Access
        </p>
        <h1 style={{ margin: 0, fontSize: "clamp(34px, 8vw, 58px)", lineHeight: 0.95 }}>
          Login to Movianx
        </h1>
        <p style={{ margin: "18px 0 28px", color: "rgba(255,255,255,0.68)", lineHeight: 1.65 }}>
          Viewer accounts are being prepared for saved worlds, watch history, and early access.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          <Link
            href="/watch"
            style={{
              display: "inline-flex",
              minHeight: 46,
              alignItems: "center",
              justifyContent: "center",
              padding: "12px 18px",
              borderRadius: 999,
              color: "#fff",
              textDecoration: "none",
              fontWeight: 760,
              background: "linear-gradient(135deg, #a52121 0%, #741414 100%)",
            }}
          >
            Explore Experiences
          </Link>
          <TrackedLink
            href="/dashboard/welcome"
            event="account_logged_in"
            properties={{ account_type: "creator", source: "login_page" }}
            dedupeKey="creator-login-page"
            style={{
              display: "inline-flex",
              minHeight: 46,
              alignItems: "center",
              justifyContent: "center",
              padding: "12px 18px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.14)",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 760,
              background: "rgba(255,255,255,0.08)",
            }}
          >
            Creator Login
          </TrackedLink>
        </div>
      </section>
    </main>
  );
}
