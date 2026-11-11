import { PrismaClient } from '@prisma/client';
import { users } from './seed-data/users';
import { categories } from "./seed-data/categories";

const prisma = new PrismaClient();

async function main() {
    await prisma.$transaction(async (tx) => {
        await tx.user.createMany({
            data: users,
            skipDuplicates: true,
        });

        await tx.category.createMany({
            data: categories,
            skipDuplicates: true,
        });
    });

  console.log('Users seeded successfully!');
}

main()
    .catch(e => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
