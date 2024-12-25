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
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "./ui/input";
import axios from "axios";
import { useState } from "react";
import { Website } from "./Dashboard";

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
        name: name,
        url: url,
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Add artificial delay if needed
      
      setName('');
      setUrl('');
      console.log('Website added successfully:', response.data);
      if (onAddition) {
        //@ts-expect-error IDK the typefix
        onAddition();
      }
      setIsOpen(false);
    } catch (error) {
      console.error('Error adding website:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Website
        </Button>
      </AlertDialogTrigger>
      
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add New Website</AlertDialogTitle>
        </AlertDialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label>Website Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter website name"
              className="mt-1 bg-white/80 dark:bg-zinc-900/80 border-zinc-300/50 dark:border-zinc-600/50"
            />
          </div>
          
          <div>
            <Label>Website URL</Label>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="mt-1 bg-white/80 dark:bg-zinc-900/80 border-zinc-300/50 dark:border-zinc-600/50"
            />
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <Button 
            onClick={handleAddWebsite} 
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add Website
              </>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}