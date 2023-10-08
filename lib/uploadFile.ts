import { ID, storage } from "@/appwrite";

const uploadImage = async (image: File) => {
    if (!image) return;
    
    const imageUploaded = await storage.createFile(
        process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID!,
        ID.unique(),
        image
    ); 

    return imageUploaded
}

export default uploadImage;