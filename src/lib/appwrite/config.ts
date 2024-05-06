import { Client,Databases,Account,Avatars,Storage } from "appwrite";

export const appwriteConfig = {
    projectId: import.meta.env.VITE_APPWRRITE_PROJECT_ID,
    url:import.meta.env.VITE_APPWRITE_URL,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
    pdfstorageId: import.meta.env.VITE_APPWRITE_PDFSTORAGEDATABASE_ID,
    userCollectionId: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
    postCollectionId: import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID,
    savesCollectionId: import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID,
    requestItemCollectionId: import.meta.env.VITE_APPWRITE_REQUESTITEM_COLLECTION_ID
}

export const client= new Client();

client.setProject(appwriteConfig.projectId);
client.setEndpoint(appwriteConfig.url);

export const databases= new Databases(client);
export const account= new Account(client);
export const avatars= new Avatars(client);
export const storage= new Storage(client);