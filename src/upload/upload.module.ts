import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
