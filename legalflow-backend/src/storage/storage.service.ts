import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand, HeadBucketCommand, CreateBucketCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private s3Client: S3Client;
  private s3PresignClient: S3Client;
  private bucket: string;

  constructor() {
    const endpoint = process.env.MINIO_ENDPOINT || 'http://127.0.0.1:9000';
    const publicEndpoint = process.env.MINIO_PUBLIC_ENDPOINT || endpoint;
    const accessKeyId = process.env.MINIO_ACCESS_KEY || 'minioadmin';
    const secretAccessKey = process.env.MINIO_SECRET_KEY || 'minioadmin';
    const region = process.env.MINIO_REGION || 'us-east-1';
    this.bucket = process.env.MINIO_BUCKET || 'legalflow-docs';
    const forcePathStyle = process.env.MINIO_FORCE_PATH_STYLE === 'true';

    // Internal client for uploads
    this.s3Client = new S3Client({
      endpoint,
      region,
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle,
    });

    // Public client solely for generating presigned URLs with the external endpoint
    this.s3PresignClient = new S3Client({
      endpoint: publicEndpoint,
      region,
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle,
    });
  }

  async onModuleInit() {
    if (process.env.MINIO_AUTO_CREATE_BUCKET === 'true') {
      try {
        await this.s3Client.send(new HeadBucketCommand({ Bucket: this.bucket }));
        this.logger.log(`Bucket ${this.bucket} already exists.`);
      } catch (error: any) {
        if (error.$metadata?.httpStatusCode === 404) {
          this.logger.log(`Bucket ${this.bucket} not found. Creating...`);
          try {
            await this.s3Client.send(new CreateBucketCommand({ Bucket: this.bucket }));
            this.logger.log(`Bucket ${this.bucket} created successfully.`);
          } catch (createError) {
            this.logger.error(`Failed to create bucket ${this.bucket}`, createError);
          }
        } else {
          this.logger.error(`Error checking bucket ${this.bucket}`, error);
        }
      }
    }
  }

  async checkReadiness(): Promise<boolean> {
    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: this.bucket }));
      return true;
    } catch (error: any) {
      try {
        await this.s3Client.send(new ListObjectsV2Command({ Bucket: this.bucket, MaxKeys: 1 }));
        return true;
      } catch (fallbackError: any) {
        this.logger.error('MinIO readiness check failed');
        return false;
      }
    }
  }

  async uploadFile(key: string, file: Express.Multer.File): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    await this.s3Client.send(command);
  }

  async getPresignedUrl(key: string, expiresIn = 900): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    // Use the public client so the generated URL uses MINIO_PUBLIC_ENDPOINT
    return getSignedUrl(this.s3PresignClient, command, { expiresIn });
  }
}
