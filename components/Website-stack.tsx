import { Button } from "@/components/ui/button";
import { Plus, Loader } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "./ui/input";
import axios from "axios";
import { useState } from "react";
import { Website } from "./Dashboard";
import { toast } from '@/hooks/use-toast'

type WebsiteAdditionProps = {
  onAddition: (newWebsite: Website) => void;
};
export function WebsiteAddition({ onAddition }:WebsiteAdditionProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleAddWebsite = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/user/websites/new', {
        name,
        url,
      });
  
      // Check for specific response statuses or conditions
      if (response.status === 201) {
        // Success
        setName('');
        setUrl('');
        if (onAddition) {
          //@ts-expect-error IDK
          onAddition();
        }
        setIsOpen(false);
  
        toast({
          title: "Website Added",
          description: "The website has been added successfully.",
        });
      } else if (response.data?.msg) {
        // API returned a message for non-success cases
        toast({
          title: "Error Adding Website",
          description: response.data.msg,
          variant: "destructive",
        });
      }
    } catch (error) {
      // Handle unexpected errors (e.g., network issues)
      const errorMessage =
      //@ts-expect-error will fix
        error.response?.data?.msg || "An unexpected error occurred.";
      toast({
        title: "Error Adding Website",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-2 bg-zinc-800 hover:bg-zinc-900 text-white border-zinc-700 border-2 rounded-md transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Website
        </Button>
      </AlertDialogTrigger>
      
      <AlertDialogContent 
        className="p-6 rounded-lg shadow-lg bg-gradient-to-b from-zinc-800 to-zinc-900 dark:from-gray-100 dark:to-gray-200 max-w-lg mx-auto transition-all border border-zinc-700 dark:border-gray-300"
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-semibold text-white dark:text-gray-900">
            Add New Website
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400 dark:text-gray-600">
            Enter the name and URL of the website you&apos;d like to add.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label className="block text-sm font-medium text-zinc-300 dark:text-gray-700">Website Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter website name"
              className="mt-2 w-full bg-zinc-700/50 dark:bg-gray-100 border border-zinc-600 dark:border-gray-300 rounded-md p-3 text-white dark:text-gray-900 placeholder-zinc-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-gray-400 transition-all"
            />
          </div>
          
          <div>
            <Label className="block text-sm font-medium text-zinc-300 dark:text-gray-700">Website URL</Label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="mt-2 w-full bg-zinc-700/50 dark:bg-gray-100 border border-zinc-600 dark:border-gray-300 rounded-md p-3 text-white dark:text-gray-900 placeholder-zinc-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-gray-400 transition-all"
            />
          </div>
        </div>
        
        <AlertDialogFooter className="flex justify-between space-x-4 mt-4">
          <AlertDialogCancel 
            className="px-4 py-2 rounded-md text-zinc-300 dark:text-gray-700 border border-zinc-600 dark:border-gray-300 hover:bg-zinc-700 dark:hover:bg-gray-200 transition-all"
            disabled={loading}
          >
            Cancel
          </AlertDialogCancel>
          <Button 
            onClick={handleAddWebsite} 
            disabled={loading}
            className="gap-2 px-6 py-3 bg-zinc-700 hover:bg-zinc-800 dark:bg-gray-300 dark:hover:bg-gray-400 text-white dark:text-gray-900 rounded-md transition-all flex items-center border border-zinc-600 dark:border-gray-400"
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin mr-2" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Website
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>


  );
}