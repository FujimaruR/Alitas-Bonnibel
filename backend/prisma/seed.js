import argon2 from "argon2";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL no está definida");

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: url }),
});

async function main() {
  const email = "admin@example.com";

  const existingAdmin = await prisma.user.findUnique({ where: { email } });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: "Admin",
        email,
        password_hash: await argon2.hash("secret123"),
        role: "ADMIN",
      },
    });
    console.log("✅ Admin creado:", email);
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

  console.log("✅ Seed completado");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
