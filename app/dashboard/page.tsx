"use client";

import { useEffect } from "react";

export default function Dashboard() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const expiresIn = params.get("expiresIn");

    if (accessToken) localStorage.setItem("accessToken", accessToken!);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken!);
    if (expiresIn) localStorage.setItem("expiresIn", expiresIn!);
  }, []);

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-bold">spotify connected</h1>

      <button
        onClick={() => playSong()}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Play
      </button>

      <button
        onClick={() => pauseSong()}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Pause
      </button>

      <button
        onClick={() => nextSong()}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Next
      </button>
    </div>
  );
}

async function playSong() {
  const accessToken = localStorage.getItem("accessToken");

  await fetch("https://api.spotify.com/v1/me/player/play", {
    method: "PUT",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

async function pauseSong() {
  const accessToken = localStorage.getItem("accessToken");

  await fetch("https://api.spotify.com/v1/me/player/pause", {
    method: "PUT",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

async function nextSong() {
  const accessToken = localStorage.getItem("accessToken");

  await fetch("https://api.spotify.com/v1/me/player/next", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
