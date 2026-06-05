export type ExerciseCue = "breathe" | "bounce" | "hold" | "stretch" | "spin" | "rest";

export type ExerciseStep = {
  id: string;
  name: string;
  type: "hold" | "reps" | "rest";
  count: number; // seconds for hold/rest, target reps for reps
  instruction: string;
  cue: ExerciseCue;
};

export type WorkoutCategory = "office" | "strength" | "flex" | "cardio" | "recovery";

export type Workout = {
  id: string;
  title: string;
  subtitle: string;
  category: WorkoutCategory;
  duration: string;
  difficulty: "beginner" | "intermediate";
  points: number;
  steps: ExerciseStep[];
};

export const workouts: Workout[] = [
  {
    id: "office-5",
    title: "Office Recovery",
    subtitle: "Undo desk tension in 5 minutes",
    category: "office",
    duration: "5 min",
    difficulty: "beginner",
    points: 22,
    steps: [
      { id: "s1", name: "Shoulder rolls", type: "reps", count: 12, instruction: "Roll both shoulders backward in slow wide circles.", cue: "spin" },
      { id: "s2", name: "Neck side stretch — left", type: "hold", count: 15, instruction: "Drop left ear toward left shoulder. Keep right shoulder down.", cue: "stretch" },
      { id: "s3", name: "Neck side stretch — right", type: "hold", count: 15, instruction: "Drop right ear toward right shoulder. Keep left shoulder down.", cue: "stretch" },
      { id: "s4", name: "Wrist circles", type: "reps", count: 10, instruction: "Interlace fingers and circle both wrists slowly in each direction.", cue: "spin" },
      { id: "s5", name: "Seated spinal twist — left", type: "hold", count: 20, instruction: "Sit tall. Rotate torso left, right hand on left knee. Breathe.", cue: "stretch" },
      { id: "s6", name: "Seated spinal twist — right", type: "hold", count: 20, instruction: "Rotate torso right, left hand on right knee. Breathe deeply.", cue: "stretch" },
      { id: "s7", name: "Chest opener", type: "hold", count: 20, instruction: "Interlace hands behind back, squeeze shoulder blades together.", cue: "stretch" },
      { id: "s8", name: "Deep breath reset", type: "hold", count: 20, instruction: "Close eyes. Breathe in 4 counts, hold 4, out 6. Let go.", cue: "breathe" },
    ],
  },
  {
    id: "morning-8",
    title: "Morning Energy",
    subtitle: "Wake up body and mind in 8 minutes",
    category: "cardio",
    duration: "8 min",
    difficulty: "beginner",
    points: 35,
    steps: [
      { id: "s1", name: "March in place", type: "hold", count: 30, instruction: "Lift knees high, swing arms. Breathe through your nose.", cue: "bounce" },
      { id: "s2", name: "Arm circles", type: "reps", count: 16, instruction: "Extend arms wide. Make large slow circles, 8 each direction.", cue: "spin" },
      { id: "s3", name: "Bodyweight squats", type: "reps", count: 15, instruction: "Feet shoulder-width. Lower slowly until thighs are parallel. Rise.", cue: "bounce" },
      { id: "s4", name: "Rest", type: "rest", count: 20, instruction: "Breathe steadily. Shake out your legs gently.", cue: "rest" },
      { id: "s5", name: "Wall sit", type: "hold", count: 30, instruction: "Back against wall, thighs parallel to floor. Hold steady.", cue: "hold" },
      { id: "s6", name: "Rest", type: "rest", count: 15, instruction: "Breathe slowly. Next up: push-ups.", cue: "rest" },
      { id: "s7", name: "Push-ups", type: "reps", count: 10, instruction: "Hands shoulder-width. Lower chest to floor. Modify on knees if needed.", cue: "bounce" },
      { id: "s8", name: "Standing side stretch — left", type: "hold", count: 15, instruction: "Reach right arm overhead and lean left. Feel the side open.", cue: "stretch" },
      { id: "s9", name: "Standing side stretch — right", type: "hold", count: 15, instruction: "Reach left arm overhead and lean right.", cue: "stretch" },
      { id: "s10", name: "Cool-down breath", type: "hold", count: 20, instruction: "Hands on hips. 3 slow deep breaths, exhale longer than inhale.", cue: "breathe" },
    ],
  },
  {
    id: "strength-12",
    title: "Strength Foundation",
    subtitle: "Build base strength with no equipment",
    category: "strength",
    duration: "12 min",
    difficulty: "intermediate",
    points: 50,
    steps: [
      { id: "s1", name: "Warm-up march", type: "hold", count: 30, instruction: "High-knee march in place. Keep core gently engaged.", cue: "bounce" },
      { id: "s2", name: "Bodyweight squats", type: "reps", count: 20, instruction: "Feet hip-width, toes slightly out. Control the descent.", cue: "bounce" },
      { id: "s3", name: "Rest", type: "rest", count: 20, instruction: "Walk slowly, breathe in through nose, out through mouth.", cue: "rest" },
      { id: "s4", name: "Push-ups", type: "reps", count: 12, instruction: "Keep body straight head to toe. Lower until elbows at 90°.", cue: "bounce" },
      { id: "s5", name: "Rest", type: "rest", count: 20, instruction: "Good work. Shake out arms gently.", cue: "rest" },
      { id: "s6", name: "Reverse lunges — left", type: "reps", count: 10, instruction: "Step left foot back, lower rear knee toward floor. Return.", cue: "bounce" },
      { id: "s7", name: "Reverse lunges — right", type: "reps", count: 10, instruction: "Step right foot back, lower rear knee toward floor. Return.", cue: "bounce" },
      { id: "s8", name: "Rest", type: "rest", count: 20, instruction: "Walk it off. 20 seconds.", cue: "rest" },
      { id: "s9", name: "Plank hold", type: "hold", count: 30, instruction: "Forearms and toes. Keep hips level, core braced, breathe.", cue: "hold" },
      { id: "s10", name: "Rest", type: "rest", count: 15, instruction: "Almost done. One more.", cue: "rest" },
      { id: "s11", name: "Glute bridges", type: "reps", count: 15, instruction: "Lie on back, feet flat. Press hips up, squeeze glutes at top.", cue: "bounce" },
      { id: "s12", name: "Cool-down stretch", type: "hold", count: 30, instruction: "Lie flat, arms overhead. Take 5 slow breaths. Let body settle.", cue: "stretch" },
    ],
  },
  {
    id: "flex-7",
    title: "Full Flexibility Reset",
    subtitle: "Open tight muscles from desk and stress",
    category: "flex",
    duration: "7 min",
    difficulty: "beginner",
    points: 28,
    steps: [
      { id: "s1", name: "Neck rolls", type: "reps", count: 8, instruction: "Gently drop chin, roll ear to shoulder, continue slowly. No crunching.", cue: "spin" },
      { id: "s2", name: "Cross-body shoulder — left", type: "hold", count: 20, instruction: "Pull left arm across chest with right hand. Keep shoulder down.", cue: "stretch" },
      { id: "s3", name: "Cross-body shoulder — right", type: "hold", count: 20, instruction: "Pull right arm across chest with left hand.", cue: "stretch" },
      { id: "s4", name: "Chest opener", type: "hold", count: 25, instruction: "Hands clasped behind back, squeeze shoulder blades, look up gently.", cue: "stretch" },
      { id: "s5", name: "Standing quad — left", type: "hold", count: 20, instruction: "Stand on right foot, hold left ankle behind. Keep knees together.", cue: "hold" },
      { id: "s6", name: "Standing quad — right", type: "hold", count: 20, instruction: "Stand on left foot, hold right ankle behind.", cue: "hold" },
      { id: "s7", name: "Forward fold", type: "hold", count: 25, instruction: "Hinge at hips, soft knees. Let head and arms hang heavy.", cue: "stretch" },
      { id: "s8", name: "Hip flexor lunge — left", type: "hold", count: 20, instruction: "Left foot forward in lunge. Sink right knee toward floor. Relax.", cue: "stretch" },
      { id: "s9", name: "Hip flexor lunge — right", type: "hold", count: 20, instruction: "Right foot forward. Sink left knee toward floor.", cue: "stretch" },
      { id: "s10", name: "Child's pose", type: "hold", count: 30, instruction: "Knees wide, arms extended, forehead down. Breathe into lower back.", cue: "breathe" },
    ],
  },
  {
    id: "stress-6",
    title: "Stress Release",
    subtitle: "Calm the nervous system in 6 minutes",
    category: "recovery",
    duration: "6 min",
    difficulty: "beginner",
    points: 25,
    steps: [
      { id: "s1", name: "Shoulder shrug and drop", type: "reps", count: 10, instruction: "Inhale: lift both shoulders to ears. Exhale: let them drop completely.", cue: "bounce" },
      { id: "s2", name: "Box breath — 2 cycles", type: "hold", count: 32, instruction: "In 4, hold 4, out 4, hold 4. Repeat. Let thoughts pass like clouds.", cue: "breathe" },
      { id: "s3", name: "Jaw and face release", type: "hold", count: 20, instruction: "Open mouth wide, then relax. Unclench jaw. Soften forehead.", cue: "stretch" },
      { id: "s4", name: "Eye palming", type: "hold", count: 20, instruction: "Rub palms together to warm. Cup gently over closed eyes. Rest.", cue: "rest" },
      { id: "s5", name: "Seated forward fold", type: "hold", count: 25, instruction: "Seated, fold forward over legs. Let spine round. Breathe into back.", cue: "stretch" },
      { id: "s6", name: "Legs up the wall", type: "hold", count: 45, instruction: "Lie back, extend legs up wall or raise feet on chair. Eyes closed.", cue: "rest" },
      { id: "s7", name: "Body scan rest", type: "hold", count: 30, instruction: "Lie flat. Scan from feet to head, consciously relaxing each area.", cue: "breathe" },
    ],
  },
  {
    id: "cardio-10",
    title: "Cardio Burst",
    subtitle: "Raise heart rate with no equipment",
    category: "cardio",
    duration: "10 min",
    difficulty: "intermediate",
    points: 45,
    steps: [
      { id: "s1", name: "High knees", type: "reps", count: 30, instruction: "Drive knees up to hip height alternately, pump arms. Breathe out on each step.", cue: "bounce" },
      { id: "s2", name: "Rest", type: "rest", count: 15, instruction: "Walk slowly. Breathe deeply.", cue: "rest" },
      { id: "s3", name: "Jumping jacks", type: "reps", count: 25, instruction: "Feet together, arms down. Jump: feet wide, arms overhead. Return.", cue: "bounce" },
      { id: "s4", name: "Rest", type: "rest", count: 15, instruction: "Slow down. Two more sets.", cue: "rest" },
      { id: "s5", name: "Mountain climbers", type: "reps", count: 20, instruction: "In push-up position, drive each knee to chest alternately. Fast pace.", cue: "bounce" },
      { id: "s6", name: "Rest", type: "rest", count: 20, instruction: "Shake out your legs. Breathe.", cue: "rest" },
      { id: "s7", name: "Squat jumps", type: "reps", count: 10, instruction: "Lower into squat, explode upward. Land softly. Knees track toes.", cue: "bounce" },
      { id: "s8", name: "Rest", type: "rest", count: 20, instruction: "One last burst. You've got this.", cue: "rest" },
      { id: "s9", name: "Speed step", type: "hold", count: 30, instruction: "Step side to side quickly with arms pumping. Reduce to cool-down pace.", cue: "bounce" },
      { id: "s10", name: "Cool-down walk and breathe", type: "hold", count: 30, instruction: "Walk slowly. Big inhale through nose, long exhale through mouth.", cue: "breathe" },
    ],
  },
];

export const CATEGORY_LABELS: Record<WorkoutCategory, string> = {
  office: "Office",
  strength: "Strength",
  flex: "Flexibility",
  cardio: "Cardio",
  recovery: "Recovery",
};
