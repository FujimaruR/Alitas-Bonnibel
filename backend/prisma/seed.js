require("dotenv/config");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
import * as argon2 from "argon2";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL no está definida");

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: url }),
});

async function main() {
  const email = "admin@example.com";

  const existing = await prisma.user.findUnique({ where: { email } });

  if (!existing) {
    await prisma.user.create({
      data: {
        name: "Admin",
        email,
        password_hash: await argon2.hash("secret123"),
        role: "ADMIN",
      },
    });
    console.log("✅ Admin creado:", email);
  } else {
    console.log("ℹ️ Admin ya existe:", email);
  }


  const categories = [
    { name: "Alitas", slug: "alitas", sortOrder: 1 },
    { name: "Boneless", slug: "boneless", sortOrder: 2 },
    { name: "Papas", slug: "papas", sortOrder: 3 },
    { name: "Bebidas", slug: "bebidas", sortOrder: 4 },
    { name: "Combos", slug: "combos", sortOrder: 0 },
  ];

  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, sortOrder: c.sortOrder, isActive: true },
      create: { ...c, isActive: true },
    });
  }

  const allCats = await prisma.category.findMany({ select: { id: true, slug: true } });
  const bySlug = Object.fromEntries(allCats.map((x) => [x.slug, x.id]));

  const products = [
    {
      categoryId: bySlug["combos"],
      name: "Combo 12 Alitas",
      description: "2 sabores + papas gajo + aderezo",
      price: 189,
      imageUrl:
        "https://images.unsplash.com/photo-1604908176997-125f25cc500f?auto=format&fit=crop&w=1400&q=80",
      badges: ["Más pedido", "2 sabores"],
      sortOrder: 1,
    },
    {
      categoryId: bySlug["alitas"],
      name: "Alitas 12 pzas",
      description: "Elige 2 salsas",
      price: 179,
      imageUrl:
        "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1400&q=80",
      badges: ["2 salsas"],
      sortOrder: 1,
    },
  ].filter((p) => Number.isFinite(p.categoryId));

  for (const p of products) {
    const existing = await prisma.product.findFirst({
      where: { categoryId: p.categoryId, name: p.name },
      select: { id: true },
    });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          description: p.description,
          price: p.price,
          imageUrl: p.imageUrl,
          badges: p.badges,
          isActive: true,
          sortOrder: p.sortOrder,
        },
      });
    } else {
      await prisma.product.create({ data: { ...p, isActive: true } });
    }
  }

  console.log("✅ Seed completado");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
