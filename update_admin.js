const { PrismaClient } = require('@prisma/client');
const directUrl = "postgresql://postgres.zgjlrkovtemtrdkzvlgq:TrimitraCoachingCenter@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres";
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: directUrl
    }
  }
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
  console.log('Activated count:', result.count);
}

main().catch(console.error).finally(() => prisma.$disconnect());
