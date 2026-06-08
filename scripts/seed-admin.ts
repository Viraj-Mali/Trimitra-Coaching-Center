import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { loadEnvConfig } from '@next/env';

const prisma = new PrismaClient();

async function main() {
  const projectDir = process.cwd();
  loadEnvConfig(projectDir);

  console.log('🌱 Seeding Admin User...');

  const mobile = process.env.ADMIN_MOBILE;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Admin User';

  if (!mobile || !password) {
    console.error('❌ Error: ADMIN_MOBILE and ADMIN_PASSWORD environment variables are required.');
    console.error('Please add them to your .env or .env.local file.');
    process.exit(1);
  }

  // Check if any admin already exists
  const existingAdmin = await prisma.student.findFirst({
    where: { role: 'ADMIN' },
  });

  if (existingAdmin) {
    console.log(`⚠️ An admin user already exists (Mobile: ${existingAdmin.mobile}). Skipping admin creation.`);
    return;
  }

  // Hash the password
  const passwordHash = await bcrypt.hash(password, 12);

  // Create the admin
  await prisma.student.create({
    data: {
      rollNumber: `ADM-${new Date().getFullYear()}-001`,
      name,
      mobile,
      passwordHash,
      role: 'ADMIN',
      track: 'COMPETITIVE', // Default track
      standard: 'Admin',
    },
  });

  console.log('✅ Admin account created successfully!');
  console.log(`Mobile: ${mobile}`);
}

main()
  .catch((e) => {
    console.error('❌ Admin Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
