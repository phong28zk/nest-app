import { Injectable } from '@nestjs/common';
import { DeleteObjectCommand, GetObjectCommand, ListObjectsCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

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

  async upload(user_id: string, fileName: string, file: Buffer): Promise<void> {
    const uploadResponse = await this.s3Client.send(
      new PutObjectCommand({
        Bucket: 'nestjs-uploader-indicloud',
        Key: `${user_id}/${fileName}`,
        Body: file,
        ACL: 'bucket-owner-full-control',
      }),
    );
  }

  async getFileOfUser(user_id: string) {
    const listObjects = await this.s3Client.send(
      new ListObjectsCommand({
        Bucket: 'nestjs-uploader-indicloud',
        Prefix: `${user_id}/`,
      }),
    );
    return listObjects.Contents;
  }

  async download(user_id: string, fileName: string) {
    const downloadResponse = await this.s3Client.send(
      new GetObjectCommand({
        Bucket: 'nestjs-uploader-indicloud',
        Key: `${user_id}/${fileName}`,
      }),
    );
    return downloadResponse.Body;
  }

  async delete(user_id: string, fileName: string) {
    const deleteResponse = await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: 'nestjs-uploader-indicloud',
        Key: `${user_id}/${fileName}`,
      }),
    );
    
  }
}