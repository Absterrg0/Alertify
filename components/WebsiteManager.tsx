'use client'
import React, { useState } from "react";
import { Table,TableHeader,TableRow,TableHead,TableBody,TableCell } from "./ui/table";
import { Badge } from "./ui/badge";
import { AlertCircle, CheckCircle, ExternalLink, MessageSquare, MoreVertical, XCircle } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Alert,AlertDescription,AlertTitle } from "./ui/alert";
import { Bell,Shell } from "lucide-react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { DropdownMenu,DropdownMenuItem,DropdownMenuTrigger,DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/button";
const initialWebsites = [
    { id: "1", name: "My Blog", url: "https://myblog.com", status: "active", verified: true },
    { id: "2", name: "Portfolio", url: "https://portfolio.com", status: "active", verified: false },
    { id: "3", name: "E-commerce Store", url: "https://mystore.com", status: "inactive", verified: true },
    { id: "4", name: "Company Website", url: "https://mycompany.com", status: "active", verified: true },
    { id: "5", name: "Personal Project", url: "https://myproject.com", status: "inactive", verified: false },
  ]
export function WebsiteManager() {
      const [websites, setWebsites] = useState(initialWebsites)
      const [selectedWebsites, setSelectedWebsites] = useState(new Set());
    const tableData = [
        { name: "BitTo", price: "$0.000000231", volume: "$9,152,921", marketCap: "$432,624,043", holders: "18,212" },
        { name: "Starkey", price: "$0.000003521", volume: "$15,428,853", marketCap: "$123,456,789", holders: "12,121" },
        { name: "PayPay", price: "$0.000002331", volume: "$10,527,511", marketCap: "$573,116,043", holders: "22,321" },
    ];
    const toggleWebsite = (id) => {
        const newSelected = new Set(selectedWebsites);
        if (newSelected.has(id)) {
          newSelected.delete(id);
        } else {
          newSelected.add(id);
        }
        setSelectedWebsites(newSelected);
      };
    
      const toggleAll = () => {
        if (selectedWebsites.size === websites.length) {
          setSelectedWebsites(new Set());
        } else {
          setSelectedWebsites(new Set(websites.map(web => web.id)));
        }
      };
    
      const deactivateWebsite = (id) => {
        setWebsites(websites.map(website => 
          website.id === id ? { ...website, verified: false } : website
        ));
      };
    
      const deactivateSelected = () => {
        setWebsites(websites.map(website => 
          selectedWebsites.has(website.id) ? { ...website, verified: false } : website
        ));
        setSelectedWebsites(new Set());
      };
    

    return (
        <div className="bg-zinc-500">
                    <div className="bg-gray-900 text-white min-h-screen p-6 mx-auto">
            {/* Top Section */}
            <div className="  mt-24 ml-10 flex space-x-12">
                {/* Price and Card */}
                <div className="p-8 bg-gradient-to-r from-gray-900 w-8/12 to-gray-800 rounded-xl shadow-2xl">
                <div className="text-center flex justify-between text-2xl p-3">
                List of websites
                <span className="bg-red-600 hover:bg-zinc-100 px-2 rounded-lg text-black items-center flex "> <Plus></Plus></span>

                </div>

                <Table className="min-w-full bg-gray-900 text-gray-200 shadow-lg rounded-lg overflow-hidden">
  <TableHeader className="w-full py-5 bg-gray-800 text-gray-300 text-2xl font-bold text-center">
    <TableRow className="border-b border-gray-700 mt-2">
      <TableHead className="w-[50px]">
        <Checkbox
          checked={selectedWebsites.size === websites.length}
          onCheckedChange={toggleAll}
        />
      </TableHead>
      <TableHead className="text-gray-300">Name</TableHead>
      <TableHead className="text-gray-300">URL</TableHead>
      <TableHead className="text-gray-300">Status</TableHead>
      <TableHead className="text-gray-300">Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {websites.map((website) => (
      <TableRow
        key={website.id}
        className={`
          border-b border-gray-700 hover:bg-gray-800/80 transition-colors
          ${selectedWebsites.has(website.id) ? 'bg-gray-800/70' : ''}
        `}
      >
        <TableCell>
          <Checkbox
            checked={selectedWebsites.has(website.id)}
            onCheckedChange={() => toggleWebsite(website.id)}
          />
        </TableCell>
        <TableCell className="font-semibold">
          {website.name}
        </TableCell>
        <TableCell>
          <a
            href={website.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
          >
            {website.url}
            <ExternalLink className="ml-2 w-4 h-4" />
          </a>
        </TableCell>
        <TableCell>
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              website.verified
                ? 'bg-green-900/50 text-green-400'
                : 'bg-red-900/50 text-red-400'
            }`}
          >
            {website.verified ? 'Active' : 'Inactive'}
          </span>
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-700 transition-colors">
                <MoreVertical className="h-4 w-4 text-gray-300" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-800 text-gray-200 rounded-md shadow-md">
              {website.verified && (
                <DropdownMenuItem
                  className="text-red-400 hover:text-red-300 cursor-pointer flex items-center"
                  onClick={() => deactivateWebsite(website.id)}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Deactivate
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>


    </div>
            <div className="w-3/12">
            <Card className="bg-white/5 backdrop-blur-lg border-cyan-500/20 overflow-hidden">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <Shell className="h-6 w-6 text-cyan-400" />
                  <h2 className="text-2xl font-semibold text-white">Notification Types</h2>
                </div>
                <div className="space-y-3">
                  {[
                    { type: 'alert', icon: AlertCircle, label: 'Surface Alert', description: 'Floats at the top' },
                    { type: 'alert-dialog', icon: MessageSquare, label: 'Deep Dive', description: 'Full-screen experience' },
                    { type: 'toast', icon: Bell, label: 'Bubble Toast', description: 'Quick floating message' },
                  ].map(({ type, icon: Icon, label, description }) => (
                    <button
                      key={type}
                    //   onClick={() => setSelectedType(type as NotificationType)}
                      className={cn(
                        "w-full p-4 rounded-lg transition-all duration-200 border border-cyan-500/20",
                        // selectedType === type 
                        //   ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20" 
                        //   : "bg-white/5 hover:bg-white/10 text-white"
                      )}
                    >
                      <div className="flex items-start">
                        <Icon className="h-5 w-5 mt-0.5 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">{label}</div>
                          <div className="text-sm opacity-80">{description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
            </div>
            </div>
        </div>

        </div>

    );
}
