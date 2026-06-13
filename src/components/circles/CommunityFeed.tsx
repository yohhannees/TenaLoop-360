"use client";

import { useEffect, useState } from "react";
import { Heart, Send } from "lucide-react";
import { CIRCLE_POSTS } from "@/lib/circle-content";
import { cn } from "@/lib/utils";

const MOOD_DOT: Record<string, string> = {
  Low:  "bg-[#C4503A]",
  Okay: "bg-[#C4956A]",
  Good: "bg-[#0A2318]",
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
  const staticPosts = CIRCLE_POSTS.filter((p) => p.circleId === circleId);

  const [posts, setPosts] = useState<Post[]>(staticPosts);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [counts, setCounts] = useState<Record<string, number>>(
    Object.fromEntries(staticPosts.map((p) => [p.id, p.likes])),
  );
  const [newText, setNewText] = useState("");
  const [newMood, setNewMood] = useState<"Good" | "Okay" | "Low">("Okay");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/circles/${circleId}/posts`)
      .then((r) => r.json())
      .then((data: { posts?: Post[] }) => {
        if (data.posts?.length) {
          setPosts(data.posts);
          setCounts(Object.fromEntries(data.posts.map((p) => [p.id, p.likes])));
        }
      })
      .catch(() => {});
  }, [circleId]);

  function toggle(id: string) {
    setLiked((prev) => {
      const wasLiked = !!prev[id];
      setCounts((c) => ({ ...c, [id]: (c[id] ?? 0) + (wasLiked ? -1 : 1) }));
      return { ...prev, [id]: !wasLiked };
    });
  }

  async function submitPost() {
    if (!newText.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/circles/${circleId}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newText.trim(), mood: newMood }),
      });
      if (res.ok) {
        const data = (await res.json()) as { post?: Post };
        if (data.post) {
          setPosts((prev) => [data.post!, ...prev]);
          setCounts((c) => ({ ...c, [data.post!.id]: 0 }));
        }
        setNewText("");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-4">
      {/* Post composer */}
      <div className="rounded-2xl border border-[#0A2318]/10 bg-[#E5EAE3] p-3.5">
        <div className="mb-2 flex gap-2">
          {(["Good", "Okay", "Low"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setNewMood(m)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold transition",
                newMood === m
                  ? "bg-[#0A2318] text-[#E8EDE7]"
                  : "bg-[#0A2318]/8 text-[#0A2318]/55 hover:bg-[#0A2318]/14",
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", MOOD_DOT[m])} />
              {m}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") void submitPost(); }}
            placeholder="Share something anonymously..."
            className="min-w-0 flex-1 rounded-xl border border-[#0A2318]/10 bg-[#E8EDE7] px-3 py-2 text-sm text-[#0A2318] placeholder:text-[#0A2318]/35 outline-none focus:border-[#8C6246]"
          />
          <button
            type="button"
            onClick={submitPost}
            disabled={!newText.trim() || submitting}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0A2318] text-[#E8EDE7] transition hover:bg-[#1A3A2A] disabled:opacity-40"
          >
            <Send size={15} />
          </button>
        </div>
      </div>

      {/* Posts list */}
      {posts.length === 0 ? (
        <p className="text-sm text-[#0A2318]/45">No posts yet — be the first to share!</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="rounded-2xl border border-[#0A2318]/10 bg-[#E5EAE3] p-3.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={cn("h-2 w-2 rounded-full", MOOD_DOT[post.mood] ?? "bg-[#C4956A]")} />
                <span className="text-xs font-semibold text-[#0A2318]/55">{post.author}</span>
              </div>
              <span className="text-[10px] text-[#0A2318]/35">{post.timeAgo}</span>
            </div>

            <p className="mt-2 text-sm leading-6 text-[#0A2318]/80">{post.text}</p>

            <button
              type="button"
              onClick={() => toggle(post.id)}
              className={cn(
                "mt-2 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition",
                liked[post.id]
                  ? "bg-[#8C6246]/15 text-[#8C6246]"
                  : "bg-[#0A2318]/6 text-[#0A2318]/45 hover:bg-[#0A2318]/10 hover:text-[#0A2318]/70",
              )}
            >
              <Heart size={11} fill={liked[post.id] ? "currentColor" : "none"} />
              {counts[post.id] ?? 0} helpful
            </button>
          </div>
        ))
      )}
    </div>
  );
}
