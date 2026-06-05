"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { CIRCLE_POSTS } from "@/lib/circle-content";
import { cn } from "@/lib/utils";

const MOOD_DOT: Record<string, string> = {
  Low:  "bg-[#C4503A]",
  Okay: "bg-[#C4956A]",
  Good: "bg-[#0A2318]",
};

type Props = { circleId: string };

export default function CommunityFeed({ circleId }: Props) {
  const posts = CIRCLE_POSTS.filter((p) => p.circleId === circleId);
  const [liked, setLiked]   = useState<Record<string, boolean>>({});
  const [counts, setCounts] = useState<Record<string, number>>(
    Object.fromEntries(posts.map((p) => [p.id, p.likes])),
  );

  function toggle(id: string) {
    setLiked((prev) => {
      const wasLiked = !!prev[id];
      setCounts((c) => ({ ...c, [id]: c[id] + (wasLiked ? -1 : 1) }));
      return { ...prev, [id]: !wasLiked };
    });
  }

  if (posts.length === 0) {
    return <p className="text-sm text-[#0A2318]/45">No posts yet — be the first to share!</p>;
  }

  return (
    <div className="grid gap-3">
      {posts.map((post) => (
        <div key={post.id} className="rounded-2xl border border-[#0A2318]/10 bg-[#E5EAE3] p-3.5">
          {/* Author row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={cn("h-2 w-2 rounded-full", MOOD_DOT[post.mood])} />
              <span className="text-xs font-semibold text-[#0A2318]/55">{post.author}</span>
            </div>
            <span className="text-[10px] text-[#0A2318]/35">{post.timeAgo}</span>
          </div>

          {/* Post text */}
          <p className="mt-2 text-sm leading-6 text-[#0A2318]/80">{post.text}</p>

          {/* Like reaction */}
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
            {counts[post.id]} helpful
          </button>
        </div>
      ))}
    </div>
  );
}
