import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}
  
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_REGION'),
    credentials: {
      accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY'),
      secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
    },
  });

  async upload(user_id: string, fileName: string, file: Buffer) {
    console.log(user_id, fileName, file);
    const uploadResponse = await this.s3Client.send(
      new PutObjectCommand({
        Bucket: 'nestjs-uploader-indicloud',
        Key: `${user_id}/${fileName}`,
        Body: file,
        ACL: 'public-read',
      }),
    );
  }

  // async download(fileName: string, file: Buffer) {
  //   const downloadResponse = await this.s3Client.send(
  //     new PutObjectCommand({
  //       Bucket: 'nestjs-uploader-indicloud',
  //       Key: `${fileName}`,
  //       Body: file,
  //     }),
  //   );
  //   return downloadResponse;
  // }
}