import { useEffect, useState } from "react";
import { UploadButton } from "@/lib/uploadthing";
import { Loader2, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FileUploadProps {
  onUploadComplete: (url: string, name: string) => void;
  currentFile?: string;
  uploadType: "imageUploader";
  isDark: boolean; // Theme prop to toggle between light and dark modes
}

export function FileUpload({
  onUploadComplete,
  currentFile,
  uploadType,
  isDark,
}: FileUploadProps) {
  const [fileName, setFileName] = useState(currentFile || "");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <div className="w-full space-y-2">
      <div className="flex flex-col gap-1.5">
        {/* Upload container */}
        <div className="flex items-center gap-3">
          {/* File Name Input */}
          <div className="flex-1">
            <input
              type="text"
              value={fileName}
              readOnly
              placeholder="No file chosen"
              className={`w-full px-3 mb-4 h-10 text-sm rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring ${
                isDark
                  ? "bg-zinc-800 text-zinc-200 placeholder:text-muted-foreground"
                  : "bg-white text-gray-800 placeholder:text-muted-foreground"
              }`}
              aria-label="Uploaded file name"
            />
          </div>

          {/* Upload Button */}
          <div className="relative">
            <UploadButton
              onUploadBegin={() => {
                setIsUploading(true);
                setError(null);
              }}
              endpoint={uploadType}
              config={{ mode: "auto" }}
              onClientUploadComplete={(res) => {
                setIsUploading(false);
                if (res && res.length > 0) {
                  setFileName(res[0].name);
                  onUploadComplete(res[0].url, res[0].name);
                }
              }}
              onUploadError={(error) => {
                setIsUploading(false);
                setError(error.message);
              }}
              content={{
                button({ ready }) {
                  return (
                    <div
                      className={`flex items-center gap-2 h-10 px-4 rounded-md transition ${
                        isUploading
                          ? "opacity-50 cursor-not-allowed"
                          : isDark
                          ? "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      }`}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          <span>{ready ? "Choose File" : "Loading..."}</span>
                        </>
                      )}
                    </div>
                  );
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Alert
          variant="destructive"
          className={`${
            isDark ? "bg-red-800 text-red-200" : "bg-red-100 text-red-600"
          }`}
        >
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default FileUpload;
