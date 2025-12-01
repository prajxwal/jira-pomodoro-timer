"use client";

export default function CallbackPage() {
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  if (!code) return <p>no code from spotify</p>;

  window.location.href = `/api/auth/spotify/callback?code=${code}`;

  return <p>logging in...</p>;
}
