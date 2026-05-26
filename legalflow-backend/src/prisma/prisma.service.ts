import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super(); // Dùng config mặc định, tự đọc url từ DATABASE_URL (.env)
  }

  async onModuleInit() {
    await this.$connect();
  }
}
