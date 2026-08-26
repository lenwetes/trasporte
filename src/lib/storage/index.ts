import { LocalStorageProvider, IStorageProvider } from "./core";
import { S3StorageProvider } from "./s3";

const providerType = process.env.STORAGE_PROVIDER || "LOCAL";

let storageProvider: IStorageProvider;

if (providerType === "S3") {
    storageProvider = new S3StorageProvider();
} else {
    // Default to local storage (Private folder + Proxy URL)
    storageProvider = new LocalStorageProvider("storage/uploads", "/api/files");
}

export { storageProvider };
export type { IStorageProvider };
