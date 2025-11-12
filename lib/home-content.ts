import { prisma } from "@/lib/db";
import { HOME_CONTENT_SLUG, defaultHomeContent } from "@/constants/home-content";
import { HomeContentData, homeContentSchema } from "@/schemas/home-content";

export async function getHomeContentData(): Promise<HomeContentData> {
  const record = await prisma.homeContent.findUnique({
    where: { slug: HOME_CONTENT_SLUG },
  });

  if (!record) {
    const created = await prisma.homeContent.create({
      data: {
        slug: HOME_CONTENT_SLUG,
        content: defaultHomeContent,
      },
    });
    return homeContentSchema.parse(created.content);
  }

  try {
    return homeContentSchema.parse(record.content);
  } catch (error) {
    console.error("Failed to parse home content. Falling back to defaults.", error);
    return defaultHomeContent;
  }
}

export async function saveHomeContentData(content: HomeContentData) {
  const parsed = homeContentSchema.parse(content);
  await prisma.homeContent.upsert({
    where: { slug: HOME_CONTENT_SLUG },
    update: { content: parsed },
    create: {
      slug: HOME_CONTENT_SLUG,
      content: parsed,
    },
  });
  return parsed;
}
