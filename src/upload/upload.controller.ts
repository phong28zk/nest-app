import {
  Controller,
  ParseFilePipe,
  Post,
  Req,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtGuard } from 'src/auth/jwt.guard';

@Controller('action')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('upload')
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Req() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 1000 }),
          // new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const user_id = req.user['id'];
    console.log('\x1b[33mReaching upload controller\x1b[0m\n=========================================');
    console.log('user_id:', user_id);
    await this.uploadService.upload(user_id, file.originalname, file.buffer);
  }
}
