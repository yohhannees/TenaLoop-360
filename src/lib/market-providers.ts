import { Provider } from "./types";

export type ExtendedProvider = Provider & {
  description: string;
  rating: number;
  reviews: number;
  emoji: string;
  tags: string[];
  availableToday: boolean;
  slots: string[];
  passportDiscount: number;
  distance: string;
  hours: string;
  phone: string;
  imageUrl: string;
  sourceUrl: string;
};

export type WellnessPackage = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  providerIds: string[];
  providerNames: string[];
  originalEtb: number;
  discountPct: number;
  finalEtb: number;
  bestFor: string;
};

export const extendedProviders: ExtendedProvider[] = [
  {
    id: "signature-wellness-bole",
    name: "Signature Wellness",
    type: "Fitness, Pilates, yoga and recovery",
    area: "Bole",
    price: "1200 ETB",
    bestFor: "Stress, low movement, posture, and guided fitness",
    category: "Movement",
    emoji: "SW",
    description:
      "Signature Wellness is a Bole-based wellness and luxury fitness center with gym, studio, Pilates/yoga-style classes, and recovery services. TenaLoop routes users here for structured movement and body reset support.",
    rating: 4.8,
    reviews: 0,
    tags: ["Bole", "gym", "studio", "recovery"],
    availableToday: true,
    slots: ["07:00 AM", "10:00 AM", "05:30 PM", "07:00 PM"],
    passportDiscount: 15,
    distance: "Bole",
    hours: "See provider schedule",
    phone: "See provider source",
    imageUrl: "https://www.signaturewellnesseth.com/gym-bg.png",
    sourceUrl: "https://www.signaturewellnesseth.com/",
  },
  {
    id: "radisson-rainforest-spa",
    name: "Rainforest Day Spa at Radisson Blu",
    type: "Spa, massage, salon and fitness center",
    area: "Kazanchis",
    price: "1800 ETB",
    bestFor: "Burnout, muscle tension, and full nervous-system reset",
    category: "Recovery",
    emoji: "RB",
    description:
      "Rainforest Day Spa at Radisson Blu Hotel, Addis Ababa offers facials, massages, manicures, pedicures, hair styling, and access to a fitness center. Useful when a check-in shows burnout, pain, or recovery need.",
    rating: 4.7,
    reviews: 0,
    tags: ["spa", "massage", "salon", "fitness"],
    availableToday: true,
    slots: ["09:00 AM", "12:00 PM", "03:00 PM", "06:00 PM"],
    passportDiscount: 10,
    distance: "Kazanchis",
    hours: "Daily 7:00 AM - 10:00 PM",
    phone: "+251 11 515 7600",
    imageUrl: "/tenaloop-photo-market.jpg",
    sourceUrl:
      "https://www.radissonhotels.com/en-us/hotels/radisson-blu-addis-ababa/fitness-wellness",
  },
  {
    id: "shifam-fitness-jackros",
    name: "SHI-FAM Fitness Center",
    type: "Premium gym, spa and wellness center",
    area: "Jackros, Bole",
    price: "950 ETB",
    bestFor: "Strength, cardio, group classes, sauna, and steam recovery",
    category: "Movement",
    emoji: "SF",
    description:
      "SHI-FAM Fitness Center is a premium gym, spa, and wellness center in Jackros/Bole with personal training, group classes, sauna, and steam-style recovery support.",
    rating: 4.6,
    reviews: 0,
    tags: ["gym", "spa", "personal training", "sauna"],
    availableToday: true,
    slots: ["06:30 AM", "09:00 AM", "05:00 PM", "07:30 PM"],
    passportDiscount: 12,
    distance: "Jackros, Bole",
    hours: "See provider schedule",
    phone: "+251 93 185 8585",
    imageUrl: "/tenaloop-photo-move.jpg",
    sourceUrl: "https://shifamfitness.com/",
  },
  {
    id: "american-medical-center-checkup",
    name: "American Medical Center",
    type: "Health check-up and specialist appointment",
    area: "Addis Ababa",
    price: "1500 ETB",
    bestFor: "BP, glucose, nutrition, and general health check-up routing",
    category: "Food",
    emoji: "AMC",
    description:
      "American Medical Center lists annual health check-up services, laboratory testing, telemedicine, and appointment paths including nutrition and dietetics. TenaLoop routes BP/glucose-focused users here for licensed support.",
    rating: 4.5,
    reviews: 0,
    tags: ["check-up", "nutrition", "lab", "telemedicine"],
    availableToday: true,
    slots: ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"],
    passportDiscount: 0,
    distance: "Addis Ababa",
    hours: "Appointments by specialty",
    phone: "+251 94 964 8401",
    imageUrl: "/tenaloop-photo-dashboard.jpg",
    sourceUrl: "https://amcethiopia.com/",
  },
  {
    id: "ethiopian-skylight-serenity-spa",
    name: "Serenity Spa at Ethiopian Skylight Hotel",
    type: "Spa, gym, pool, sauna and steam",
    area: "Bole Airport",
    price: "2200 ETB",
    bestFor: "Recovery day, massage, sauna, and low-stress movement",
    category: "Recovery",
    emoji: "ESH",
    description:
      "Ethiopian Skylight Hotel recreation facilities include a fully equipped gym, indoor/outdoor pools, sauna, steam, and Serenity Spa massage services near Bole International Airport.",
    rating: 4.7,
    reviews: 0,
    tags: ["spa", "gym", "sauna", "pool"],
    availableToday: true,
    slots: ["10:00 AM", "01:00 PM", "04:00 PM", "07:00 PM"],
    passportDiscount: 10,
    distance: "Bole International Airport",
    hours: "See hotel recreation schedule",
    phone: "+251 11 681 8181",
    imageUrl:
      "https://www.ethiopianskylighthotel.com/images/default-source/page%27s-content-library/recreation/spa-1050-x-700e8bb1cf7-a52e-425a-8464-e619458668b0.jpg",
    sourceUrl: "https://www.ethiopianskylighthotel.com/recreations",
  },
  {
    id: "inter-luxury-spa-kazanchis",
    name: "Inter Luxury Hotel Beauty Salon & Spa",
    type: "Spa, steam, sauna, jacuzzi and massage",
    area: "Kazanchis",
    price: "1600 ETB",
    bestFor: "Massage, steam, sauna, and post-work recovery",
    category: "Recovery",
    emoji: "IL",
    description:
      "Inter Luxury Hotel's Beauty Salon & Spa lists steam, sauna, jacuzzi, massage, lockers, and relaxation area services in Addis Ababa.",
    rating: 4.4,
    reviews: 0,
    tags: ["massage", "sauna", "steam", "jacuzzi"],
    availableToday: false,
    slots: ["10:30 AM", "02:30 PM", "05:30 PM"],
    passportDiscount: 10,
    distance: "Kazanchis",
    hours: "See hotel spa schedule",
    phone: "See provider source",
    imageUrl: "/tenaloop-photo-contact.jpg",
    sourceUrl: "https://interluxuryhotel.com/beauty-salon-spa/",
  },
  {
    id: "the-place-gym-spa",
    name: "The Place Gym and Spa",
    type: "Gym, personal training, salon and spa",
    area: "Bole Cape Verde St.",
    price: "1300 ETB",
    bestFor: "Consistent movement, trainer support, and spa handoff",
    category: "Movement",
    emoji: "TP",
    description:
      "The Place Luxury Living lists The Place Gym as a contemporary Addis Ababa fitness facility with personal training, plus a separate spa and wellness contact at the same Bole Cape Verde Street location.",
    rating: 4.6,
    reviews: 0,
    tags: ["gym", "personal training", "spa", "Bole"],
    availableToday: true,
    slots: ["07:00 AM", "12:00 PM", "06:00 PM"],
    passportDiscount: 10,
    distance: "Near EU Delegation, Bole",
    hours: "See provider schedule",
    phone: "+251 11 668 4268",
    imageUrl: "/tenaloop-photo-move.jpg",
    sourceUrl: "https://theplaceluxuryliving.com/contact/",
  },
  {
    id: "tulsi-ayurveda-yoga",
    name: "Tulsi Ayurveda, Yoga and Wellness Center",
    type: "Yoga, Ayurveda, massage and wellness",
    area: "Addis Ababa",
    price: "900 ETB",
    bestFor: "Gentle yoga, breathwork, body awareness, and relaxation",
    category: "Stress",
    emoji: "TY",
    description:
      "Tulsi is an Addis Ababa wellness center focused on yoga, Ayurveda, massage, and individual empowerment. TenaLoop routes users here for stress regulation and gentle body awareness.",
    rating: 4.6,
    reviews: 0,
    tags: ["yoga", "Ayurveda", "massage", "mindfulness"],
    availableToday: false,
    slots: ["Wednesday 06:00 PM", "Saturday 10:00 AM"],
    passportDiscount: 10,
    distance: "Addis Ababa",
    hours: "See provider source",
    phone: "+251 92 114 7695",
    imageUrl: "/tenaloop-photo-mind.jpg",
    sourceUrl:
      "https://www.tripadvisor.com/Attraction_Review-g293791-d12919803-Reviews-Tulsi-Addis_Ababa.html",
  },
];

export const wellnessPackages: WellnessPackage[] = [
  {
    id: "bole-recovery-reset",
    title: "Bole Recovery Reset",
    subtitle: "Signature Wellness + Skylight Serenity Spa",
    emoji: "BR",
    providerIds: ["signature-wellness-bole", "ethiopian-skylight-serenity-spa"],
    providerNames: ["Signature Wellness", "Serenity Spa"],
    originalEtb: 3400,
    discountPct: 15,
    finalEtb: 2890,
    bestFor: "Stress, low movement, and recovery day signals",
  },
  {
    id: "kazanchis-calm-pack",
    title: "Kazanchis Calm Pack",
    subtitle: "Radisson Rainforest Spa + Inter Luxury Spa",
    emoji: "KC",
    providerIds: ["radisson-rainforest-spa", "inter-luxury-spa-kazanchis"],
    providerNames: ["Rainforest Day Spa", "Inter Luxury Spa"],
    originalEtb: 3400,
    discountPct: 12,
    finalEtb: 2992,
    bestFor: "Burnout, muscle tension, and poor sleep",
  },
  {
    id: "fitness-start-pack",
    title: "Fitness Start Pack",
    subtitle: "SHI-FAM + The Place Gym",
    emoji: "FS",
    providerIds: ["shifam-fitness-jackros", "the-place-gym-spa"],
    providerNames: ["SHI-FAM Fitness", "The Place Gym"],
    originalEtb: 2250,
    discountPct: 10,
    finalEtb: 2025,
    bestFor: "Low movement and beginner strength habits",
  },
  {
    id: "health-check-pack",
    title: "Health Check Pack",
    subtitle: "American Medical Center + Tulsi",
    emoji: "HC",
    providerIds: ["american-medical-center-checkup", "tulsi-ayurveda-yoga"],
    providerNames: ["American Medical Center", "Tulsi"],
    originalEtb: 2400,
    discountPct: 8,
    finalEtb: 2208,
    bestFor: "BP, glucose, nutrition, and stress-aware lifestyle reset",
  },
];
