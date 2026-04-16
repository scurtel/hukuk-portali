import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.author.upsert({
    where: { slug: "av-ceren-sumer-cilli" },
    create: {
      slug: "av-ceren-sumer-cilli",
      name: "Avukat Ceren Sümer Cilli",
      title: "Aile, Miras ve Gayrimenkul Hukuku Avukatı — Hukuk Portalı editörlüğü",
      bio: "Hukuk Portalı içeriklerinin hukuki çerçevesini ve güncelliğini yönlendirir.",
      avatar: "/images/placeholder-author.jpg"
    },
    update: {
      name: "Avukat Ceren Sümer Cilli",
      title: "Aile, Miras ve Gayrimenkul Hukuku Avukatı — Hukuk Portalı editörlüğü",
      bio: "Hukuk Portalı içeriklerinin hukuki çerçevesini ve güncelliğini yönlendirir.",
      avatar: "/images/placeholder-author.jpg"
    }
  });

  const categories = [
    {
      slug: "haber",
      name: "Haberler",
      description: "Güncel hukuk haberleri",
      type: "haber"
    },
    {
      slug: "rehber",
      name: "Rehberler",
      description: "Uygulamaya yönelik rehber içerikler",
      type: "rehber"
    },
    {
      slug: "analiz",
      name: "Analizler",
      description: "Derinlemesine hukuki analizler",
      type: "analiz"
    }
  ];

  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      create: c,
      update: { name: c.name, description: c.description, type: c.type }
    });
  }
}

main()
  .then(() => {
    console.log("Prisma seed tamamlandı (Author + Category).");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
