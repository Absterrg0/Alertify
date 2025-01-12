'use client'

import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, ExternalLink, Search, X } from 'lucide-react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import axios from "axios";
import { WebsiteAddition } from "./Website-stack";
import { toast } from '@/hooks/use-toast'
import { Website } from "./Dashboard";

interface VerifiedWebsiteManagerProps {
  websites: Website[];
  selectedWebsites: Website[];
  onWebsitesChange: (websites: Website[]) => void;
  onSelectedWebsitesChange: (selectedWebsites: Website[]) => void;
}

export default function VerifiedWebsiteManager({ 
  websites, 
  selectedWebsites, 
  onWebsitesChange, 
  onSelectedWebsitesChange 
}: VerifiedWebsiteManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleVerify = async (url: string) => {
    try {
      const response = await axios.post('/api/notify/verify', { url });
      if (response.status === 200) {
        console.log('URL verification successful:', response.data);
        const updatedWebsites:Website[] = websites.map(site =>
          site.url === url
            ? { ...site, status: 'ACTIVE', isVerified: true }
            : site
        );
        onWebsitesChange(sortWebsites(updatedWebsites));
        toast({
          title: "Website Verified",
          description: "The website has been successfully verified.",
        });
      } else {
        console.error('Verification failed:', response.data);
        toast({
          title: "Verification Failed",
          description: "There was an error verifying the website.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error during verification:', error);
      toast({
        title: "Verification Error",
        description: "An unexpected error occurred during verification.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeactivate = async (id: string) => {
    try {
      const response = await axios.post(`/api/user/websites/update/${id}`);
      if (response.status === 200) {
        const updatedWebsites:Website[] = websites.map(site =>
          site.id === id
            ? { ...site, status: 'DEACTIVATED', isVerified: false }
            : site
        );
        onWebsitesChange(sortWebsites(updatedWebsites));
        toast({
          title: "Website Deactivated",
          description: "The website has been successfully deactivated.",
        });
      }
    } catch (error) {
      console.error('Error deactivating website:', error);
      toast({
        title: "Deactivation Error",
        description: "An error occurred while deactivating the website.",
        variant: "destructive",
      });
    }
  };

  const handleSelect = (website: Website) => {
    const updatedSelectedWebsites = selectedWebsites.some(site => site.id === website.id)
      ? selectedWebsites.filter(site => site.id !== website.id)
      : [...selectedWebsites, website];
  
    onSelectedWebsitesChange(updatedSelectedWebsites);
  };
  
  const sortWebsites = (websitesToSort: Website[]) => {
    return websitesToSort.sort((a, b) => {
      const order = { ACTIVE: 0, PENDING: 1, DEACTIVATED: 2 };
      return (order[a.status] || 3) - (order[b.status] || 3);
    });
  };

  const filteredWebsites = websites.filter(site =>
    site && site.name && site.url && (
      site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.url.toLowerCase().includes(searchTerm.toLowerCase())
    )
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
            
            <WebsiteAddition onAddition={(newWebsite:Website) => onWebsitesChange([...websites, newWebsite])} />
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
                      onSelectedWebsitesChange(e.target.checked ? filteredWebsites : []);
                    }}
                    checked={selectedWebsites.length === filteredWebsites.length && filteredWebsites.length > 0}
                  />
                </TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verified</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWebsites.map(site => (
                <TableRow
                  key={site.id}
                  className={`
                    transition-colors duration-200
                    ${selectedWebsites.some(s => s.id === site.id) ? "bg-emerald-50/50 dark:bg-emerald-900/20" : ""}
                    ${site.status === 'DEACTIVATED' ? "opacity-60" : ""}
                    hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50
                  `}
                >
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedWebsites.some(s => s.id === site.id)}
                      onChange={() => handleSelect(site)}
                      disabled={site.status === 'DEACTIVATED'}
                      className={`rounded border-zinc-300 dark:border-zinc-600 ${
                        site.status === 'DEACTIVATED' ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
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
                        rel="noopener noreferrer"
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
                        ${site.status === 'ACTIVE'
                          ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' 
                          : site.status === 'PENDING'
                          ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
                          : 'bg-gradient-to-r from-zinc-500/20 to-zinc-600/20 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800'}
                      `}
                    >
                      {site.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`
                        ${site.isVerified
                          ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' 
                          : 'bg-gradient-to-r from-zinc-500/20 to-zinc-600/20 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800'}
                      `}
                    >
                      {site.isVerified ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {site.status === 'DEACTIVATED' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:from-emerald-500/20 hover:to-emerald-600/20"
                        onClick={() =>{}}
                      >
                        <X></X>
                      </Button>
                    ) : site.status === 'ACTIVE' ? (
                      <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-gradient-to-r from-red-500/10 to-red-600/10 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 hover:from-red-500/20 hover:to-red-600/20"
                        >
                          Deactivate
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-xl font-semibold text-red-600 dark:text-red-400">
                            ⚠️ Warning: Permanent Deactivation
                          </AlertDialogTitle>
                          <div className="mt-4 space-y-4 text-zinc-700 dark:text-zinc-300">
                            <AlertDialogDescription className="font-medium">
                              THIS WEBSITE CANNOT BE REACTIVATED THROUGH THE DASHBOARD.
                            </AlertDialogDescription>
                            <AlertDialogDescription>
                              If you need to reactivate this website in the future, you will need to contact developer support.
                            </AlertDialogDescription>
                            <AlertDialogDescription className="text-sm italic">
                              Are you sure you want to proceed with deactivation?
                            </AlertDialogDescription>
                          </div>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-6">
                          <AlertDialogCancel className="bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeactivate(site.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Yes, Deactivate Website
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:from-emerald-500/20 hover:to-emerald-600/20"
                        onClick={() => handleVerify(site.url)}
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