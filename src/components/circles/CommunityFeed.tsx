"use client";

import { useEffect, useState } from "react";
import { Heart, Send } from "lucide-react";

const INK = "#211D17";
const PAPER = "#F6F1E8";
const BROWN = "#9A6B4A";

const MOOD_COLOR: Record<string, string> = {
  Low: "#C05E3A",
  Okay: "#C2913C",
  Good: "#5E7A5C",
};

type Post = {
  id: string;
  circleId: string;
  author: string;
  text: string;
  mood: string;
  timeAgo: string;
  likes: number;
};

type Props = { circleId: string };

export default function CommunityFeed({ circleId }: Props) {
  return <CommunityFeedInner key={circleId} circleId={circleId} />;
}

function CommunityFeedInner({ circleId }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [newText, setNewText] = useState("");
  const [newMood, setNewMood] = useState<"Good" | "Okay" | "Low">("Okay");
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/circles/${circleId}/posts`, { cache: "no-store" })
      .then(async (response) => {
        const data = (await response.json().catch(() => null)) as { posts?: Post[]; error?: string } | null;
        if (!response.ok) throw new Error(data?.error || "Community posts could not be loaded.");
        return data;
      })
      .then((data) => {
        if (cancelled) return;
        const nextPosts = data?.posts ?? [];
        setPosts(nextPosts);
        setCounts(Object.fromEntries(nextPosts.map((post) => [post.id, post.likes])));
      })
      .catch((err) => {
        if (cancelled) return;
        setPosts([]);
        setCounts({});
        setError(err instanceof Error ? err.message : "Community posts could not be loaded.");
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [circleId]);

  function toggle(id: string) {
    setLiked((prev) => {
      const wasLiked = !!prev[id];
      setCounts((current) => ({ ...current, [id]: (current[id] ?? 0) + (wasLiked ? -1 : 1) }));
      return { ...prev, [id]: !wasLiked };
    });
  }

  async function submitPost() {
    if (!newText.trim() || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const response = await fetch(`/api/circles/${circleId}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newText.trim(), mood: newMood }),
      });
      const data = (await response.json().catch(() => null)) as { post?: Post; error?: string } | null;
      if (!response.ok) throw new Error(data?.error || "Post could not be shared.");
      if (data?.post) {
        setPosts((prev) => [data.post!, ...prev]);
        setCounts((current) => ({ ...current, [data.post!.id]: 0 }));
      }
      setNewText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Post could not be shared.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-4">
      {/* Composer */}
      <div className="rounded-2xl p-4" style={{ background: PAPER, border: `1px solid ${INK}10` }}>
        <div className="mb-2.5 flex gap-2">
          {(["Good", "Okay", "Low"] as const).map((mood) => {
            const on = newMood === mood;
            return (
              <button key={mood} type="button" onClick={() => setNewMood(mood)}
                className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold transition"
                style={{ background: on ? MOOD_COLOR[mood] : "#fff", color: on ? "#fff" : `${INK}65`, border: `1px solid ${on ? MOOD_COLOR[mood] : `${INK}12`}` }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: on ? "#fff" : MOOD_COLOR[mood] }} />
                {mood}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2">
          <input type="text" value={newText} onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") void submitPost(); }}
            placeholder="Share something anonymously…"
            className="min-w-0 flex-1 rounded-xl px-3.5 py-2.5 text-sm outline-none"
            style={{ background: "#fff", border: `1px solid ${INK}12`, color: INK }} />
          <button type="button" onClick={submitPost} disabled={!newText.trim() || submitting}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl transition disabled:opacity-40"
            style={{ background: INK, color: PAPER }}>
            <Send size={16} />
          </button>
        </div>
      </div>

      {error && (
        <p className="rounded-2xl px-3 py-2 text-sm font-semibold" style={{ background: "#C05E3A14", color: "#C05E3A", border: "1px solid #C05E3A33" }}>
          {error}
        </p>
      )}

      {isLoading ? (
        <p className="text-sm" style={{ color: `${INK}45` }}>Loading community posts…</p>
      ) : posts.length === 0 ? (
        <p className="text-sm" style={{ color: `${INK}45` }}>No posts yet — be the first to share.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="rounded-2xl p-4" style={{ background: PAPER, border: `1px solid ${INK}0D` }}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: MOOD_COLOR[post.mood] ?? "#C2913C" }} />
                <span className="text-xs font-semibold" style={{ color: `${INK}60` }}>{post.author}</span>
              </div>
              <span className="text-[10px]" style={{ color: `${INK}35` }}>{post.timeAgo}</span>
            </div>
            <p className="mt-2 text-sm leading-6" style={{ color: `${INK}88` }}>{post.text}</p>
            <button type="button" onClick={() => toggle(post.id)}
              className="mt-2.5 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition"
              style={liked[post.id] ? { background: `${BROWN}1F`, color: BROWN } : { background: `${INK}08`, color: `${INK}50` }}>
              <Heart size={11} fill={liked[post.id] ? "currentColor" : "none"} />
              {counts[post.id] ?? 0} helpful
            </button>
          </div>
        ))
      )}
    </div>
  );
}
