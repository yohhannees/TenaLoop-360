import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { circles } from "../src/lib/circles";
import { dashboardConfigDefaults } from "../src/lib/dashboard-config";
import { extendedProviders, wellnessPackages } from "../src/lib/market-providers";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/tenaloop?schema=public";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function seedProviders() {
  for (const provider of extendedProviders) {
    await prisma.provider.upsert({
      where: { id: provider.id },
      update: {
        name: provider.name,
        type: provider.type,
        area: provider.area,
        price: provider.price,
        bestFor: provider.bestFor,
        category: provider.category,
        description: provider.description,
        avgRating: provider.rating,
        reviewCount: provider.reviews,
        emoji: provider.emoji,
        tags: provider.tags,
        availableToday: provider.availableToday,
        slots: provider.slots,
        passportDiscount: provider.passportDiscount,
        distance: provider.distance,
        hours: provider.hours,
        phone: provider.phone,
        imageUrl: provider.imageUrl,
        sourceUrl: provider.sourceUrl,
        active: true,
      },
      create: {
        id: provider.id,
        name: provider.name,
        type: provider.type,
        area: provider.area,
        price: provider.price,
        bestFor: provider.bestFor,
        category: provider.category,
        description: provider.description,
        avgRating: provider.rating,
        reviewCount: provider.reviews,
        emoji: provider.emoji,
        tags: provider.tags,
        availableToday: provider.availableToday,
        slots: provider.slots,
        passportDiscount: provider.passportDiscount,
        distance: provider.distance,
        hours: provider.hours,
        phone: provider.phone,
        imageUrl: provider.imageUrl,
        sourceUrl: provider.sourceUrl,
        active: true,
      },
    });
  }
}

async function seedBundles() {
  for (const bundle of wellnessPackages) {
    await prisma.wellnessBundle.upsert({
      where: { id: bundle.id },
      update: {
        title: bundle.title,
        subtitle: bundle.subtitle,
        emoji: bundle.emoji,
        providerIds: bundle.providerIds,
        providerNames: bundle.providerNames,
        originalEtb: bundle.originalEtb,
        discountPct: bundle.discountPct,
        finalEtb: bundle.finalEtb,
        bestFor: bundle.bestFor,
        active: true,
      },
      create: {
        id: bundle.id,
        title: bundle.title,
        subtitle: bundle.subtitle,
        emoji: bundle.emoji,
        providerIds: bundle.providerIds,
        providerNames: bundle.providerNames,
        originalEtb: bundle.originalEtb,
        discountPct: bundle.discountPct,
        finalEtb: bundle.finalEtb,
        bestFor: bundle.bestFor,
        active: true,
      },
    });
  }
}

async function seedCircles() {
  for (const circle of circles) {
    await prisma.circleRecord.upsert({
      where: { id: circle.id },
      update: {
        name: circle.name,
        time: circle.time,
        focus: circle.focus,
        challenge: circle.challenge,
        active: true,
      },
      create: {
        id: circle.id,
        name: circle.name,
        time: circle.time,
        focus: circle.focus,
        challenge: circle.challenge,
        active: true,
      },
    });
  }
}

async function seedDashboardConfig() {
  await prisma.appSetting.upsert({
    where: { id: "dashboard" },
    update: { value: dashboardConfigDefaults },
    create: {
      id: "dashboard",
      value: dashboardConfigDefaults,
    },
  });
}

async function main() {
  console.log("Seeding real Ethiopian providers, wellness bundles, circles, and dashboard settings...");
  await seedProviders();
  await seedBundles();
  await seedCircles();
  await seedDashboardConfig();
  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
