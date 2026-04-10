import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const tokens = await prisma.verificationToken.findMany({ include: { user: true }});
    console.log(JSON.stringify(tokens, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
