"use client";

import Script from "next/script";
import { useState, useEffect } from "react";
import { PomodoroTimer } from "./components/PomodoroTimer";
import { SpotifyPlayer } from "./components/SpotifyPlayer";
import { TodoList } from "./components/TodoList";
import { Music, List, Settings } from "lucide-react";

export default function Home() {
  const [showPlayer, setShowPlayer] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const access = params.get("accessToken");
    const refresh = params.get("refreshToken");

    if (access) {
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh || "");

      window.history.replaceState({}, "", "/");
    }

    if (localStorage.getItem("accessToken")) {
      setLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setLoggedIn(false);
    setShowSettings(false);
  };

  return (
    <div className="min-h-screen bg-black relative flex items-center justify-center p-10 text-white">

      <Script src="https://sdk.scdn.co/spotify-player.js" strategy="afterInteractive" />

      {/* LOGIN BUTTON (HIDDEN AFTER LOGIN) */}
      {!loggedIn && (
        <a
          href="/api/auth/spotify/login"
          className="fixed top-6 right-6 bg-green-500 text-black px-4 py-2 rounded-xl shadow hover:scale-105 transition"
        >
          Login with Spotify
        </a>
      )}

      {/* Pomodoro Timer */}
      <PomodoroTimer />

      {/* Floating Buttons (Bottom-left) */}
      <div className="fixed bottom-6 left-6 flex flex-col gap-4">

        {/* Settings Button */}
        <button
          className="bg-green-500 text-black p-4 rounded-full shadow-xl hover:scale-110 transition"
          onClick={() => setShowSettings(true)}
        >
          <Settings className="w-6 h-6" />
        </button>

        {/* Tasks */}
        <button
          className="bg-green-500 text-black p-4 rounded-full shadow-xl hover:scale-110 transition"
          onClick={() => setShowTasks(true)}
        >
          <List className="w-6 h-6" />
        </button>

        {/* Music */}
        <button
          onClick={() => setShowPlayer(true)}
          className="bg-green-500 text-black p-4 rounded-full shadow-xl hover:scale-110 transition"
        >
          <Music className="w-6 h-6" />
        </button>

      </div>

      {/* Spotify Modal */}
      {showPlayer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <SpotifyPlayer onClose={() => setShowPlayer(false)} />
        </div>
      )}

      {/* Tasks Modal */}
      {showTasks && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <TodoList onClose={() => setShowTasks(false)} />
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-black/90 p-6 rounded-3xl border border-green-500/40 shadow-2xl w-[300px] text-center">

            <h2 className="text-green-400 text-xl mb-3">Settings</h2>

            <p className="text-green-500/80 mb-4 text-sm">
              Pomodoro Focus App  
              <br />v1.0 • Made by Prajwal  
            </p>

            {loggedIn ? (
              <p className="text-green-300 text-xs mb-3">Spotify: Logged in</p>
            ) : (
              <p className="text-red-400 text-xs mb-3">Spotify: Not logged in</p>
            )}

            {/* LOGOUT BUTTON MOVED HERE */}
            {loggedIn && (
              <button
                onClick={handleLogout}
                className="w-full bg-green-500 text-black py-2 rounded-xl hover:scale-105 transition mb-3"
              >
                Logout
              </button>
            )}

            <button
              onClick={() => setShowSettings(false)}
              className="w-full bg-green-500 text-black py-2 rounded-xl hover:scale-105 transition"
            >
              Close
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
