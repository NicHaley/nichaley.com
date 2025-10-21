"use client";

import { useEffect, useState } from "react";

export default function AppleMusicTokenClient() {
  const [devToken, setDevToken] = useState<string | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/apple-music/dev-token", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch developer token");
        const { token } = (await res.json()) as { token: string };
        setDevToken(token);
      } catch (e) {
        setError((e as Error).message);
      }
    })();
  }, []);

  async function ensureMusicKitLoaded() {
    if ((window as unknown as { MusicKit?: unknown }).MusicKit) return;
    await new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://js-cdn.music.apple.com/musickit/v3/musickit.js";
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Failed to load MusicKit"));
      document.head.appendChild(s);
    });
  }

  async function authorize() {
    try {
      setLoading(true);
      setError(null);
      if (!devToken) throw new Error("Missing developer token");
      await ensureMusicKitLoaded();
      const MusicKit = (
        window as unknown as {
          MusicKit: {
            configure: (options: {
              developerToken: string;
              app: { name: string; build: string };
            }) => void;
            getInstance: () => { authorize: () => Promise<string> };
          };
        }
      ).MusicKit;
      MusicKit.configure({
        developerToken: devToken,
        app: { name: "nichaley.com", build: "1.0" },
      });
      const instance = MusicKit.getInstance();
      const token: string = await instance.authorize();
      setUserToken(token);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!userToken) return;
    await navigator.clipboard.writeText(userToken);
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">Apple Music User Token</h1>
      <p className="text-sm opacity-80">
        This page authorizes with MusicKit and shows your Music-User-Token. Keep
        it secret.
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={authorize}
          disabled={loading || !devToken}
          className="px-3 py-1.5 rounded bg-black text-white disabled:opacity-50"
        >
          {loading ? "Authorizing…" : "Authorize & Get Token"}
        </button>
        {userToken && (
          <button
            type="button"
            onClick={copy}
            className="px-3 py-1.5 rounded border"
          >
            Copy token
          </button>
        )}
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {userToken && (
        <textarea
          className="w-full h-40 p-2 border rounded text-xs"
          readOnly
          value={userToken}
        />
      )}
    </div>
  );
}
