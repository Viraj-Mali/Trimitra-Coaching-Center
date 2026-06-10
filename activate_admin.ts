import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL,
    },
  },
});

async function main() {
  const result = await prisma.student.updateMany({
    where: {
      mobile: {
        in: ['9665269059', '9999000000']
      }
    },
    data: {
      isActive: true
    }
  });
  console.log(`Activated ${result.count} admins.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
