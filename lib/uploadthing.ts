// utils/uploadthing.ts
import {
    generateUploadButton,
    generateUploadDropzone,
  } from "@uploadthing/react";
  import { generateReactHelpers } from "@uploadthing/react";
  import { OurFileRouter } from "@/app/api/uploadthing/core";
  
  export const UploadButton = generateUploadButton<typeof OurFileRouter>();
  export const UploadDropzone = generateUploadDropzone<typeof OurFileRouter>();
  export const { useUploadThing, uploadFiles } = generateReactHelpers<typeof OurFileRouter>();
  
  // Helper function to get permitted file types
  export const getPermittedFileTypes = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return '.jpg,.jpeg,.png';
    }
  };
  
  // Helper function to get file size limits
  export const getFileSizeLimit = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return '2MB';
    }
  };