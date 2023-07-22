import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import * as bcrypt from 'bcrypt';
import { userTestPassword } from './constants';
import { randomUUID } from 'node:crypto';

async function main() {
  // Create test user
  const password = await bcrypt.hash(userTestPassword, 10);
  await prisma.user.create({
    data: {
      email: 'teste@email.com',
      name: randomUUID(),
      password,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
