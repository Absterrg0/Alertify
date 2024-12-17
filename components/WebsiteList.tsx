'use client'

import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, CheckCircle, Plus, ExternalLink, Search } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type Website = {
  id: number;
  name: string;
  url: string;
  verified: boolean;
  deactivated: boolean;
  lastChecked?: string;
};

interface VerifiedWebsiteManagerProps {
  onWebsitesChange?: (websites: Website[]) => void;
  initialData?: Website[];
}

const defaultWebsites: Website[] = [
  { 
    id: 1, 
    name: "Main Website", 
    url: "https://example.com", 
    verified: true, 
    deactivated: false,
    lastChecked: "2024-12-14T10:30:00Z"
  },
  { 
    id: 2, 
    name: "Blog", 
    url: "https://blog.example.com", 
    verified: false, 
    deactivated: false,
    lastChecked: "2024-12-14T11:45:00Z"
  },
  { 
    id: 3, 
    name: "Support Portal", 
    url: "https://support.example.com", 
    verified: true, 
    deactivated: false,
    lastChecked: "2024-12-14T09:15:00Z"
  },
  { 
    id: 4, 
    name: "Legacy Site", 
    url: "https://old.example.com", 
    verified: false, 
    deactivated: true,
    lastChecked: "2024-12-13T16:20:00Z"
  },
];

export default function VerifiedWebsiteManager({ onWebsitesChange, initialData }: VerifiedWebsiteManagerProps) {
  const [mounted, setMounted] = useState(false);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [selectedWebsites, setSelectedWebsites] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newWebsiteName, setNewWebsiteName] = useState("");
  const [newWebsiteUrl, setNewWebsiteUrl] = useState("");

  useEffect(() => {
    setMounted(true);
    setWebsites(initialData || defaultWebsites);
  }, [initialData]);

  useEffect(() => {
    if (mounted && onWebsitesChange) {
      onWebsitesChange(websites);
    }
  }, [websites, mounted, onWebsitesChange]);

  const handleAddWebsite = () => {
    const newWebsite: Website = {
      id: Math.max(...websites.map(w => w.id)) + 1,
      name: newWebsiteName,
      url: newWebsiteUrl,
      verified: false,
      deactivated: false,
      lastChecked: new Date().toISOString()
    };
    setWebsites(prev => [...prev, newWebsite]);
    setNewWebsiteName("");
    setNewWebsiteUrl("");
  };

  const handleVerify = (id: number) => {
    setWebsites(prev =>
      prev.map(site => (site.id === id ? { ...site, verified: true } : site))
    );
  };

  const handleDeactivate = (id: number) => {
    setWebsites(prev =>
      prev.map(site =>
        site.id === id ? { ...site, deactivated: true, verified: false } : site
      )
    );
  };

  const handleSelect = (id: number) => {
    setSelectedWebsites(prev =>
      prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
    );
  };

  if (!mounted) {
    return null;
  }

  const filteredWebsites = websites.filter(site =>
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-800 backdrop-blur-sm border border-zinc-300/50 dark:border-zinc-700/50 shadow-xl">
      <CardHeader className="border-b border-zinc-200/50 dark:border-zinc-700/50 bg-gradient-to-r from-zinc-50/50 to-zinc-100/50 dark:from-zinc-800/50 dark:to-zinc-900/50 p-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <Input
              placeholder="Search websites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-72 bg-white/80 dark:bg-zinc-900/80 border-zinc-300/50 dark:border-zinc-600/50 backdrop-blur-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            {selectedWebsites.length > 0 && (
              <span className="text-sm text-zinc-600 dark:text-zinc-300 bg-zinc-200/50 dark:bg-zinc-700/50 px-3 py-1 rounded-full">
                {selectedWebsites.length} selected
              </span>
            )}
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Website
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 backdrop-blur-sm border-zinc-200/50 dark:border-zinc-700/50">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-xl font-bold bg-gradient-to-r from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300 bg-clip-text text-transparent">
                    Add New Website
                  </AlertDialogTitle>
                  <div className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="website-name" className="text-zinc-700 dark:text-zinc-300">Website Name</Label>
                        <Input 
                          id="website-name" 
                          value={newWebsiteName}
                          onChange={(e) => setNewWebsiteName(e.target.value)}
                          placeholder="Enter website name"
                          className="mt-1 bg-white/80 dark:bg-zinc-900/80 border-zinc-300/50 dark:border-zinc-600/50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="website-url" className="text-zinc-700 dark:text-zinc-300">Website URL</Label>
                        <Input 
                          id="website-url" 
                          value={newWebsiteUrl}
                          onChange={(e) => setNewWebsiteUrl(e.target.value)}
                          placeholder="https://example.com"
                          className="mt-1 bg-white/80 dark:bg-zinc-900/80 border-zinc-300/50 dark:border-zinc-600/50"
                        />
                      </div>
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-6">
                  <AlertDialogCancel className="bg-zinc-200/50 hover:bg-zinc-300/50 dark:bg-zinc-700/50 dark:hover:bg-zinc-600/50">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleAddWebsite}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                  >
                    Add Website
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="rounded-lg border border-zinc-200/50 dark:border-zinc-700/50 overflow-hidden bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900">
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    className="rounded border-zinc-300 dark:border-zinc-600"
                    onChange={e => {
                      setSelectedWebsites(e.target.checked ? filteredWebsites.map(w => w.id) : []);
                    }}
                    checked={selectedWebsites.length === filteredWebsites.length && filteredWebsites.length > 0}
                  />
                </TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Last Checked</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWebsites.map(site => (
                <TableRow
                  key={site.id}
                  className={`
                    transition-colors duration-200
                    ${selectedWebsites.includes(site.id) ? "bg-emerald-50/50 dark:bg-emerald-900/20" : ""}
                    ${site.deactivated ? "opacity-60" : ""}
                    hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50
                  `}
                >
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedWebsites.includes(site.id)}
                      onChange={() => handleSelect(site.id)}
                      className="rounded border-zinc-300 dark:border-zinc-600"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-zinc-400" />
                        <span className="font-medium text-zinc-900 dark:text-white">{site.name}</span>
                      </div>
                      <a 
                        href={site.url} 
                        target="_blank" 
                        className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 mt-1 flex items-center gap-1"
                      >
                        {site.url}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`
                        ${site.verified
                          ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' 
                          : 'bg-gradient-to-r from-zinc-500/20 to-zinc-600/20 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800'}
                      `}
                    >
                      {site.verified ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                      {site.lastChecked 
                        ? new Date(site.lastChecked).toLocaleString() 
                        : 'Never'
                      }
                    </span>
                  </TableCell>
                  <TableCell>
                    {site.deactivated ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:from-emerald-500/20 hover:to-emerald-600/20"
                        onClick={() => setWebsites(prev =>
                          prev.map(s => s.id === site.id ? { ...s, deactivated: false } : s)
                        )}
                      >
                        Reactivate
                      </Button>
                    ) : site.verified ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gradient-to-r from-red-500/10 to-red-600/10 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 hover:from-red-500/20 hover:to-red-600/20"
                        onClick={() => handleDeactivate(site.id)}
                      >
                        Deactivate
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:from-emerald-500/20 hover:to-emerald-600/20"
                        onClick={() => handleVerify(site.id)}
                      >
                        Verify
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

