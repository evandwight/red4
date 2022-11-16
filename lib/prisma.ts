// lib/prisma.ts
import { PrismaClient } from '@prisma/client';
import { PrismaClient as PrismaClientViews } from 'prisma/generated/client-views'


let prisma: PrismaClient;
export let prismaView: PrismaClientViews;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
  prismaView = new PrismaClientViews();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
    global.prismaView = new PrismaClientViews();
  }
  prisma = global.prisma;
  prismaView = global.prismaView;
}

export default prisma;
