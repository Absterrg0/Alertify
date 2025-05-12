"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Sparkles, RefreshCcw, Loader2 } from "lucide-react";
import { FaRobot } from "react-icons/fa";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

const gradientOptions = ["to right", "to left", "-45 deg", "+45 deg"];

export default function AiNotification({
  onGenerate,
}: {
  onGenerate: (preset: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!description.trim()) return;

    setLoading(true);
    setError("");

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `
Generate a JSON object for a UI notification preset with the following structure:

{
  id: string,
  name: string,
  title: string,
  description: string,
  backgroundColor: string,
  textColor: string,
  borderColor: string,
  borderRadius: number,
  isGradient: boolean,
  useLogo: boolean,
  logoUrl: string
}

Requirements:
- Match this description: "${description}"
- Use gradient color format like: linear-gradient(${gradientOptions.join(
        " | "
      )}, #startColor, #endColor)
- Output must be valid JSON inside triple backticks \`\`\`
`;

      const result = await model.generateContent(prompt);
      const rawText = result.response.text();

      const jsonMatch = rawText.match(/```(?:json)?([\s\S]*?)```/) || [null, rawText];
      const parsed = JSON.parse(jsonMatch[1].trim());

      onGenerate(parsed);
      setDescription("");
      setOpen(false);
    } catch (err: any) {
      console.error("Error generating content:", err);
      setError("⚠️ Failed to generate notification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2"
        aria-label="Generate notification using AI"
      >
        <FaRobot className="text-xl" /> Generate with AI
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5" /> Describe Your Notification
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-3">
            <Input
              autoFocus
              placeholder="e.g., Create a warning alert with a gradient background..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <DialogFooter className="mt-4 flex gap-2 justify-end">
            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
              {loading ? "Generating..." : "Generate"}
            </Button>
            <Button
              onClick={handleGenerate}
              variant="ghost"
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" /> Retry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
