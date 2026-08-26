import { writeFile, unlink, mkdir } from "node:fs/promises";
import { createReadStream } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { Readable } from "node:stream";

export interface FileMetadata {
    path: string; // Internal path (e.g. absolute fs path or S3 key)
    url: string; // Public accessible URL
    filename: string; // Unique filename
    originalName: string;
    size: number;
    mimeType: string;
}

export interface IStorageProvider {
    save(file: File, folder?: string): Promise<FileMetadata>;
    delete(path: string): Promise<void>;
    getFileStream(path: string): Promise<Readable | null>;
}

export class LocalStorageProvider implements IStorageProvider {
    private uploadDir: string;
    private publicUrlBase: string;

    constructor(
        uploadDir: string = "public/uploads",
        publicUrlBase: string = "/uploads",
    ) {
        this.uploadDir = join(process.cwd(), uploadDir);
        this.publicUrlBase = publicUrlBase;
    }

    async save(file: File, folder: string = ""): Promise<FileMetadata> {
        const ext = file.name.split(".").pop();
        const uniqueFilename = `${randomUUID()}.${ext}`;

        const targetDir = this.uploadDir + (folder ? "/" + folder : "");
        const absolutePath = targetDir + "/" + uniqueFilename;

        await mkdir(targetDir, { recursive: true });

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(absolutePath, buffer);

        const relativeUrlPath = join(folder, uniqueFilename).replace(/\\/g, "/");
        const url = `${this.publicUrlBase}/${relativeUrlPath}`.replace(/([^:]\/)\/+/g, "$1");

        return {
            path: absolutePath,
            url: url,
            filename: uniqueFilename,
            originalName: file.name,
            size: file.size,
            mimeType: file.type,
        };
    }

    async delete(path: string): Promise<void> {
        try {
            await unlink(path);
        } catch (error) {
            if (error instanceof Error && (error as NodeJS.ErrnoException).code !== "ENOENT") {
                console.error(`[LocalStorage] Error deleting file ${path}:`, error);
                throw error;
            }
        }
    }

    async getFileStream(path: string): Promise<Readable | null> {
        try {
            // Path incoming from API might be relative to uploadDir or absolute
            // In internal storage, we usually store absolute paths in DB.
            return createReadStream(path) as unknown as Readable;
        } catch {
            return null;
        }
    }
}
