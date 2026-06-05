# TenaLoop 360

Body-aware AI wellness passport for stress, pain, food, movement, community, and local care in Addis Ababa.

TenaLoop turns a daily check-in into a practical wellness loop: understand the body signal, get a TenaScore, do a small reset, improve the next meal, move safely, join support, and book real local services when self-care is not enough.

## Why This Exists

Most wellness apps stop at tracking. TenaLoop closes the loop.

It connects:

- **Personal signals**: mood, stress, sleep, energy, food, movement, water, pain areas, cycle context, support, screen time, coffee, sugar, BP/glucose focus.
- **AI interpretation**: TenaScore, pattern detection, rooted wellness path, and TenaBot chat coaching.
- **Real next actions**: Efoy breathing, spine-safe movement, Ethiopian food swaps, peer circles, and provider booking.
- **Behavior design**: passport stamps and points for Mind, Food, Move, Community, Experience, and Health.

TenaLoop is wellness guidance, not a diagnosis engine. It routes red flags and severe/unusual symptoms toward licensed care.

## Product Surface

| Area | Route | What It Does |
| --- | --- | --- |
| Landing | `/` | Branded product story and feature preview |
| Rooted Body | `/loop` | Daily check-in, TenaScore, body map, rooted wellness path, provider matches |
| TenaBot | `/coach` | AI wellness chat grounded in the current check-in |
| TenaPlate | `/food` | Meal logging, local food guidance, hydration, fasting support |
| TenaMove | `/move` | Breathing, mobility, routines, exercise support |
| TenaCircle | `/circles` | Peer support circles, community feed, challenges, check-ins |
| TenaMarket | `/market` | Local provider discovery, booking flow, payment options |
| Dashboard | `/dashboard` | Score trends, passport progress, business/product metrics |

## Highlight Features

- **Rooted Body Intelligence**: stress, sleep, pain, food, movement, and support are interpreted together instead of as isolated numbers.
- **Body map triage**: users select pain areas and warning signs, then get conservative movement or provider referral guidance.
- **TenaScore**: a 0-100 score with breakdowns for mind, body, food, movement, support, and women's wellness.
- **Efoy reset**: a culturally rooted breathing reset with voice support in the browser.
- **AI chat with provider choice**: TenaBot can use Gemini or OpenAI through one server-side `/api/coach` route.
- **Marketplace handoff**: saved provider matches become "Book in Market"; community matches become "Join/Open Circle."
- **Passport loop**: small actions earn stamps and points, nudging users toward repeatable wellness behavior.
- **Demo-safe fallbacks**: if an AI provider fails or quota is reached, TenaBot falls back to local safety-aware wellness logic.

## Tech Stack

- **Framework**: Next.js 16 App Router
- **UI**: React 19, Tailwind CSS 4, lucide-react icons
- **Language**: TypeScript
- **AI providers**: Google Gemini API or OpenAI Responses API
- **State**: local React context for hackathon/demo flow
- **Runtime**: server-side API keys only, no `NEXT_PUBLIC_` secrets

## AI Setup

TenaBot uses a server-side route at `/api/coach`. API keys must stay in `.env.local`, which is ignored by git.

### Gemini Free-Tier Path

Create a Gemini key in Google AI Studio:

https://aistudio.google.com/app/apikey

Then set:

```bash
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

`GEMINI_MODEL` is optional. If omitted, TenaLoop uses `gemini-2.5-flash`.

### OpenAI Path

OpenAI API billing is separate from ChatGPT Plus/Pro subscriptions. If your API dashboard shows `Credit remaining $0.00`, API calls can fail even if ChatGPT Pro is active.

```bash
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-5-mini
```

`OPENAI_MODEL` is optional. If omitted, TenaLoop uses `gpt-5-mini`.

### Provider Behavior

- `AI_PROVIDER=gemini` uses Gemini.
- `AI_PROVIDER=openai` uses OpenAI.
- If `AI_PROVIDER` is missing but `GEMINI_API_KEY` is present, TenaLoop uses Gemini.
- If the selected provider fails, the route returns a local fallback wellness reply instead of breaking the chat.

Restart the dev server after changing `.env.local`.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

Run checks:

```bash
npm run lint
npm run build
```

Run production locally:

```bash
npm run build
npm run start
```

## Project Structure

```text
src/
  app/
    api/coach/route.ts       Server-side AI provider route
    loop/page.tsx            Rooted Body daily loop
    coach/page.tsx           TenaBot chat page
    food/page.tsx            TenaPlate nutrition flow
    move/page.tsx            TenaMove movement flow
    circles/page.tsx         TenaCircle community flow
    market/page.tsx          TenaMarket booking flow
    dashboard/page.tsx       Analytics and passport view
  components/
    loop/                    Check-in, action plan, body map
    coach/                   TenaBot UI and safety panel
    food/                    Meal and hydration components
    move/                    Breathing and exercise components
    circles/                 Circle cards, feed, challenges
    market/                  Provider cards, booking modal
    marketing/               Landing experience
    layout/                  App frame and sidebar
    ui/                      Shared UI primitives
  context/
    WellnessContext.tsx      Demo state, scoring, stamps, chat messages
  hooks/
    useCoachChat.ts          Async chat flow into /api/coach
  lib/
    rooted-body.ts           TenaScore, pattern, path, provider matches
    tenabot.ts               AI prompt builders and response extractors
    score.ts                 Score labels and local fallback coach logic
    market-providers.ts      TenaMarket provider catalog
    circles.ts               TenaCircle data
```

## Demo Flow

1. Start on `/loop` and update the daily check-in.
2. Review the TenaScore, body map, pattern, and rooted wellness path.
3. Save a provider match, then click **Book in Market**.
4. Join a peer support match, then click **Open Circle**.
5. Visit `/coach` and ask TenaBot for a reset, meal swap, sleep routine, or support path.
6. Show `/dashboard` to explain the passport, score trend, and business model.

## Safety Positioning

TenaLoop does not diagnose medical or mental health conditions. It provides wellness pattern support, conservative self-care guidance, and referral prompts.

The app is designed to be cautious around:

- red flags or unusual symptoms
- severe pain, numbness, weakness, or chest pain
- pregnancy/postpartum concerns
- self-harm or immediate danger language
- symptoms that need licensed professional support

## Environment Notes

`.env.local` is ignored by git. Never commit:

- `GEMINI_API_KEY`
- `GOOGLE_API_KEY`
- `OPENAI_API_KEY`
- any provider secret or private token

If a key was pasted in a public channel, rotate it in the provider dashboard.

## Hackathon Story

TenaLoop 360 is built around one idea: wellness advice should not end at "track your mood." The product helps a user notice what their body is saying, take one safe action, and connect to people or services when the pattern needs support.

It is intentionally local-first in feel: Ethiopian meal examples, Addis provider paths, peer circles, Efoy breathing, and a wellness passport that rewards practical follow-through.
