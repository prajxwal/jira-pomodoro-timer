"use client";

import { useEffect, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, X } from "lucide-react";

interface SpotifyPlayerProps {
  onClose: () => void;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  duration: number;
}

export function SpotifyPlayer({ onClose }: SpotifyPlayerProps) {
  const [track, setTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [message, setMessage] = useState<string | null>(null);

  const accessToken =
    typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null;

  const fetchCurrent = async () => {
    if (!accessToken) return;

    const res = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (res.status === 204 || res.status === 200 && (await res.clone().json()).item == null) {
      setTrack(null);
      setMessage("open spotify, play any song once, then come back here");
      return;
    }

    if (!res.ok) {
      setTrack(null);
      setMessage("spotify playback unavailable");
      return;
    }

    const data = await res.json();

    const t: Track = {
      id: data.item.id,
      title: data.item.name,
      artist: data.item.artists.map((a: any) => a.name).join(", "),
      album: data.item.album.name,
      coverUrl: data.item.album.images[0].url,
      duration: Math.floor(data.item.duration_ms / 1000),
    };

    setTrack(t);
    setIsPlaying(data.is_playing);
    setProgress(Math.floor(data.progress_ms / 1000));
    setMessage(null);
  };

  useEffect(() => {
    fetchCurrent();
    const id = setInterval(fetchCurrent, 5000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let id: any;
    if (isPlaying && track) {
      id = setInterval(() => {
        setProgress((p) => {
          if (p >= track.duration) return p;
          return p + 1;
        });
      }, 1000);
    }
    return () => id && clearInterval(id);
  }, [isPlaying, track]);

  const api = async (endpoint: string, method = "POST") => {
    if (!accessToken) return;

    const res = await fetch(
      `https://api.spotify.com/v1/me/player/${endpoint}`,
      {
        method,
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (res.status === 404) {
      setMessage("no active device. open spotify app and start playback once.");
    } else if (!res.ok) {
      setMessage("spotify rejected this action");
    } else {
      setMessage(null);
      setTimeout(fetchCurrent, 400);
    }
  };

  const handlePlayPause = async () => {
    if (!track) {
      await api("play", "PUT");
      return;
    }
    if (isPlaying) {
      await api("pause", "PUT");
      setIsPlaying(false);
    } else {
      await api("play", "PUT");
      setIsPlaying(true);
    }
  };

  const handleNext = async () => {
    await api("next");
  };

  const handlePrevious = async () => {
    await api("previous");
  };

  const handleVolume = async (val: number) => {
    setVolume(val);
    if (!accessToken) return;
    await fetch(
      `https://api.spotify.com/v1/me/player/volume?volume_percent=${val}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (!track) {
    return (
      <div className="bg-black/90 backdrop-blur-lg rounded-3xl p-6 border border-green-500/40 text-green-300 text-center relative w-[360px]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-green-400/70 hover:text-green-300"
        >
          <X className="w-5 h-5" />
        </button>
        <p className="mb-2">no active playback found</p>
        {message && <p className="text-xs text-green-500/70">{message}</p>}
      </div>
    );
  }

  const pct = (progress / track.duration) * 100;

  return (
    <div className="bg-black/95 backdrop-blur-xl rounded-3xl p-6 border border-green-500/30 w-[360px] relative shadow-2xl">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1 text-green-400/70 hover:text-green-300"
      >
        <X className="w-5 h-5" />
      </button>

      <img
        src={track.coverUrl}
        alt={track.album}
        className="rounded-2xl w-full mb-4 border border-green-500/20 shadow-lg"
      />

      <h3 className="text-green-400 text-lg text-center">{track.title}</h3>
      <p className="text-green-500/60 text-sm text-center mb-4">
        {track.artist}
      </p>

      <div className="h-1 bg-green-500/20 rounded-full overflow-hidden mb-1">
        <div className="h-full bg-green-500" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-green-400/60 text-xs mb-4">
        <span>{formatTime(progress)}</span>
        <span>{formatTime(track.duration)}</span>
      </div>

      <div className="flex justify-center gap-4 mb-4">
        <button onClick={handlePrevious} className="text-green-400">
          <SkipBack className="w-6 h-6" />
        </button>
        <button
          onClick={handlePlayPause}
          className="bg-green-500 text-black p-3 rounded-full shadow-lg hover:scale-110 transition"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </button>
        <button onClick={handleNext} className="text-green-400">
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <Volume2 className="text-green-400/80 w-5 h-5" />
        <input
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => handleVolume(Number(e.target.value))}
          className="flex-1"
        />
        <span className="text-green-400/80 text-xs">{volume}</span>
      </div>

      {message && (
        <p className="mt-3 text-xs text-center text-green-500/70">{message}</p>
      )}
    </div>
  );
}
