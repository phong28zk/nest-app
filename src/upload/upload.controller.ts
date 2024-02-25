import {
  Controller,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Req,
  Request,
  Res,
  UploadedFile,
  StreamableFile,
  UseGuards,
  UseInterceptors,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtGuard } from 'src/auth/jwt.guard';
import { createReadStream } from 'fs';

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

  @Get('download/:fileName')
  @UseGuards(JwtGuard)
  async downloadFile(@Req() req, @Param('fileName') fileName: string, @Res() res){
    const user_id = req.user['id'];
    console.log('\x1b[33mReaching download controller\x1b[0m\n=========================================');
    console.log('user_id:', user_id);
    console.log('fileName:', fileName);
    const file = await this.uploadService.download(user_id, fileName);
    console.log('file:', file);
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.setHeader('Content-Type', 'application/octet-stream');
      
  }

  @Get('files')
  @UseGuards(JwtGuard)
  async getFiles(@Req() req) {
    const user_id = req.user['id'];
    return this.uploadService.getFileOfUser(user_id);
  }

  @Delete('delete/:fileName')
  @UseGuards(JwtGuard)
  async deleteFile(@Req() req, @Param('fileName') fileName: string) {
    const user_id = req.user['id'];
    console.log('\x1b[33mReaching delete controller\x1b[0m\n=========================================');
    console.log('user_id:', user_id);
    console.log('fileName:', fileName);
    await this.uploadService.delete(user_id, fileName);
  }

  
}
