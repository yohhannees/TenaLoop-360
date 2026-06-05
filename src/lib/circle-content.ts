export type CirclePost = {
  id: string;
  circleId: string;
  author: string; // anonymous label
  text: string;
  mood: "Low" | "Okay" | "Good";
  timeAgo: string;
  likes: number;
};

export type CircleChallenge = {
  circleId: string;
  title: string;
  days: number; // total days in challenge
  groupPct: number; // % of group who completed
};

export type CircleSession = {
  circleId: string;
  label: string; // "Tonight, 8:00 PM" etc
  isToday: boolean;
  moderatorPrompt: string;
};

export const CIRCLE_POSTS: CirclePost[] = [
  // student-stress
  { id: "p1",  circleId: "student-stress",     author: "Student A", text: "Did the wind-down routine last night. Slept by 11 PM for the first time this week. Woke up more focused.", mood: "Good", timeAgo: "2h ago",  likes: 14 },
  { id: "p2",  circleId: "student-stress",     author: "Student B", text: "Replaced the 10 PM coffee with mint tea. Less anxious during today's lecture.", mood: "Okay", timeAgo: "5h ago",  likes: 9  },
  { id: "p3",  circleId: "student-stress",     author: "Student C", text: "Failed the challenge two days in a row but completed it today. Progress not perfection.", mood: "Okay", timeAgo: "1d ago",  likes: 22 },
  { id: "p4",  circleId: "student-stress",     author: "Student D", text: "Box breathing before my exam actually helped. Hands stopped shaking after 2 cycles.", mood: "Good", timeAgo: "2d ago",  likes: 31 },

  // young-pros
  { id: "p5",  circleId: "young-pros",          author: "Professional A", text: "One screen-free lunch walk done. Needed that break more than I realized. Head felt clearer after.", mood: "Good", timeAgo: "3h ago",  likes: 18 },
  { id: "p6",  circleId: "young-pros",          author: "Professional B", text: "Set a firm 7 PM stop-work boundary today. Felt guilty for 10 minutes then just... fine.", mood: "Okay", timeAgo: "6h ago",  likes: 27 },
  { id: "p7",  circleId: "young-pros",          author: "Professional C", text: "Commute is 90 minutes each day. Started doing nasal breathing on the minibus instead of doom-scrolling.", mood: "Okay", timeAgo: "1d ago",  likes: 12 },
  { id: "p8",  circleId: "young-pros",          author: "Professional D", text: "Talked to my manager about the workload. She listened. First time I have ever done that.", mood: "Good", timeAgo: "2d ago",  likes: 41 },

  // womens-wellness
  { id: "p9",  circleId: "womens-wellness",     author: "Member A", text: "Logged my mood for 5 days. I notice I feel lowest when I skip breakfast — never connected those two before.", mood: "Good", timeAgo: "4h ago",  likes: 16 },
  { id: "p10", circleId: "womens-wellness",     author: "Member B", text: "Energy crashed at 2 PM again. Realizing it is after the heavy lunch. Trying a lighter plate tomorrow.", mood: "Okay", timeAgo: "7h ago",  likes: 11 },
  { id: "p11", circleId: "womens-wellness",     author: "Member C", text: "Did the breathing reset before a stressful meeting. It helped more than I expected. Will use it every time now.", mood: "Good", timeAgo: "1d ago",  likes: 24 },

  // fasting-wellness
  { id: "p12", circleId: "fasting-wellness",    author: "Faster A", text: "Made beyaynetu with extra gomen and less oil. Light and satisfying. No 3 PM energy crash.", mood: "Good", timeAgo: "2h ago",  likes: 19 },
  { id: "p13", circleId: "fasting-wellness",    author: "Faster B", text: "Broke the fast with shiro and salad instead of firfir. Felt lighter all afternoon.", mood: "Good", timeAgo: "5h ago",  likes: 8  },
  { id: "p14", circleId: "fasting-wellness",    author: "Faster C", text: "Had sambusa yesterday and noted how I felt afterward — tired and heavy by 4 PM. That data helps.", mood: "Okay", timeAgo: "1d ago",  likes: 15 },

  // diabetes-prevention
  { id: "p15", circleId: "diabetes-prevention", author: "Member A", text: "Replaced the sweet coffee with herbal tea. Harder than expected but my 2 PM energy is more stable.", mood: "Okay", timeAgo: "3h ago",  likes: 10 },
  { id: "p16", circleId: "diabetes-prevention", author: "Member B", text: "Walked 15 minutes after lunch for three days in a row. I feel the difference even if the scale does not.", mood: "Good", timeAgo: "8h ago",  likes: 17 },
  { id: "p17", circleId: "diabetes-prevention", author: "Member C", text: "Asked for shiro instead of pasta at the office lunch. Small choice, big signal to myself.", mood: "Good", timeAgo: "2d ago",  likes: 21 },

  // bp-lifestyle
  { id: "p18", circleId: "bp-lifestyle",        author: "Member A", text: "BP was 132/86 this morning. Two months ago it was 148/95. The daily walk is working.", mood: "Good", timeAgo: "1h ago",  likes: 29 },
  { id: "p19", circleId: "bp-lifestyle",        author: "Member B", text: "Walked after dinner for the fourth day in a row. My evening headaches are less frequent.", mood: "Good", timeAgo: "6h ago",  likes: 13 },
  { id: "p20", circleId: "bp-lifestyle",        author: "Member C", text: "Reduced the berbere in my cooking this week. Still tasty — just had to adjust the other spices.", mood: "Okay", timeAgo: "1d ago",  likes: 7  },

  // fitness-beginners
  { id: "p21", circleId: "fitness-beginners",   author: "Beginner A", text: "Completed the office break routine twice today. Shoulders feel less stiff after 8 hours at a desk.", mood: "Good", timeAgo: "4h ago",  likes: 20 },
  { id: "p22", circleId: "fitness-beginners",   author: "Beginner B", text: "First week of 15-minute walks. Legs are a bit tired but in a good way. Kept going each day.", mood: "Good", timeAgo: "9h ago",  likes: 14 },
  { id: "p23", circleId: "fitness-beginners",   author: "Beginner C", text: "The squat challenge is getting easier. Was struggling at 10 a week ago, now doing 15 smoothly.", mood: "Good", timeAgo: "2d ago",  likes: 33 },

  // walking-group
  { id: "p24", circleId: "walking-group",       author: "Walker A", text: "Made it to Meskel Square walk on Saturday. 45 minutes, beautiful morning, totally worth waking early.", mood: "Good", timeAgo: "2h ago",  likes: 38 },
  { id: "p25", circleId: "walking-group",       author: "Walker B", text: "The group energy makes it easier to keep going. Walking alone I stop at 15 minutes. Together I go 40.", mood: "Good", timeAgo: "5h ago",  likes: 25 },
  { id: "p26", circleId: "walking-group",       author: "Walker C", text: "Entoto trail Sunday — 68 minutes. Personal record. Legs ached Monday but the view was worth it.", mood: "Good", timeAgo: "1d ago",  likes: 44 },
];

export const CIRCLE_CHALLENGES: CircleChallenge[] = [
  { circleId: "student-stress",     title: "Three nights with a 20-minute wind-down", days: 5, groupPct: 64 },
  { circleId: "young-pros",         title: "One screen-free lunch walk this week",     days: 5, groupPct: 71 },
  { circleId: "womens-wellness",    title: "Log mood and sleep for 5 consecutive days", days: 5, groupPct: 58 },
  { circleId: "fasting-wellness",   title: "Build two high-fiber fasting plates",       days: 5, groupPct: 79 },
  { circleId: "diabetes-prevention",title: "Replace one high-sugar meal per day",       days: 5, groupPct: 55 },
  { circleId: "bp-lifestyle",       title: "Log BP twice and walk after lunch daily",   days: 5, groupPct: 67 },
  { circleId: "fitness-beginners",  title: "Complete three 15-minute sessions",         days: 5, groupPct: 82 },
  { circleId: "walking-group",      title: "Join one group walk and log 20+ minutes",   days: 5, groupPct: 88 },
];

export const CIRCLE_SESSIONS: CircleSession[] = [
  { circleId: "student-stress",     label: "Tonight, 8:00 PM",   isToday: true,  moderatorPrompt: "Share one small thing that helped you sleep or study better this week." },
  { circleId: "young-pros",         label: "Wed, 7:30 PM",        isToday: false, moderatorPrompt: "What is one boundary you set this week, no matter how small?" },
  { circleId: "womens-wellness",    label: "Thu, 7:00 PM",        isToday: false, moderatorPrompt: "What pattern did you notice this week between food, mood, or energy?" },
  { circleId: "fasting-wellness",   label: "Fri, 6:00 PM",        isToday: false, moderatorPrompt: "Share a fasting-friendly meal that surprised you with how good it was." },
  { circleId: "diabetes-prevention",label: "Sat, 9:00 AM",        isToday: false, moderatorPrompt: "What is one food swap you made this week and how did it feel?" },
  { circleId: "bp-lifestyle",       label: "Sat, 10:00 AM",       isToday: false, moderatorPrompt: "Share your BP log trend this week — any movement, any observation." },
  { circleId: "fitness-beginners",  label: "Sun, 8:00 AM",        isToday: false, moderatorPrompt: "What exercise felt hardest this week? What got easier?" },
  { circleId: "walking-group",      label: "Sat & Sun, 7:00 AM",  isToday: false, moderatorPrompt: "Favourite walking spot in Addis so far and why?" },
];
