// app/api/uploadthing/core.ts
import { auth } from "@/lib/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
 
const f = createUploadthing();

// Common middleware for auth checking
const authCheck = async () => {
  const session = await auth();
  if (!session?.user) throw new UploadThingError("Unauthorized");
  return { userId: session.user.id };
};

export const OurFileRouter = {
  imageUploader: f({ 
    image: { maxFileSize: "2MB", maxFileCount: 1 }
  })
    .middleware(authCheck)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Image upload complete", file.url, metadata);
      return { url: file.url };
    })
} satisfies FileRouter;

export type OurFileRouter = typeof OurFileRouter;