import { IStorageProvider, FileMetadata } from "./core";
import { randomUUID } from "crypto";
import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
} from "@aws-sdk/client-s3";
import { Readable } from "node:stream";

export class S3StorageProvider implements IStorageProvider {
    private bucket: string;
    private region: string;
    private client: S3Client;

    constructor() {
        this.bucket = process.env.AWS_BUCKET_NAME || "";
        this.region = process.env.AWS_REGION || "us-east-1";

        const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
        const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

        this.client = new S3Client({
            region: this.region,
            credentials: {
                accessKeyId: accessKeyId || "",
                secretAccessKey: secretAccessKey || "",
            },
        });
    }

    async save(file: File, folder: string = ""): Promise<FileMetadata> {
        if (!this.bucket) throw new Error("AWS_BUCKET_NAME not configured");

        const ext = file.name.split(".").pop();
        const filename = `${randomUUID()}.${ext}`;
        const key = folder ? `${folder}/${filename}`.replace(/\\/g, "/") : filename;

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        await this.client.send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: buffer,
                ContentType: file.type,
            }),
        );

        const url = `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;

        return {
            path: key,
            url: url,
            filename: filename,
            originalName: file.name,
            size: file.size,
            mimeType: file.type,
        };
    }

    async delete(path: string): Promise<void> {
        if (!this.bucket) return;

        await this.client.send(
            new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: path,
            }),
        );
    }

    async getFileStream(path: string): Promise<Readable | null> {
        if (!this.bucket) return null;
        try {
            const result = await this.client.send(
                new GetObjectCommand({
                    Bucket: this.bucket,
                    Key: path,
                }),
            );
            return result.Body as Readable;
        } catch {
            return null;
        }
    }
}
