'use client';

import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpDown, ExternalLink } from 'lucide-react';

type ApiRequest = {
  id: string;
  userId: string;
  timestamp: Date;
  endpoint: string;
  success: boolean;
};

interface ApiRequestManagerProps {
  onRequestsChange?: (requests: ApiRequest[]) => void;
  initialData?: ApiRequest[];
}

const defaultRequests = [
  {
    id: "1",
    userId: "123",
    timestamp: new Date("2024-12-13T12:34:56Z"),
    endpoint: "https://api.example.com/endpoint1",
    success: true,
  },
  {
    id: "2",
    userId: "124",
    timestamp: new Date("2024-12-14T14:22:30Z"),
    endpoint: "https://api.example.com/endpoint2",
    success: false,
  },
  {
    id: "3",
    userId: "125",
    timestamp: new Date("2024-12-15T16:45:00Z"),
    endpoint: "https://api.example.com/endpoint3",
    success: true,
  },
  {
    id: "4",
    userId: "126",
    timestamp: new Date("2024-12-13T18:30:22Z"),
    endpoint: "https://api.example.com/endpoint4",
    success: false,
  },
  {
    id: "5",
    userId: "127",
    timestamp: new Date("2024-12-14T19:15:45Z"),
    endpoint: "https://api.example.com/endpoint5",
    success: true,
  },
];

export default function ApiRequestManager({ onRequestsChange, initialData }: ApiRequestManagerProps) {
  const [mounted, setMounted] = useState(false);
  const [requests, setRequests] = useState<ApiRequest[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof ApiRequest; direction: 'asc' | 'desc' } | null>(null);
  
  useEffect(() => {
    setMounted(true);
    const data = initialData || defaultRequests;
    setRequests(data);
    
    if (mounted && onRequestsChange) {
      onRequestsChange(requests);
    }
  }, [initialData, mounted, onRequestsChange]);

  const sortedRequests = React.useMemo(() => {
    let sortableRequests = [...requests];
    if (sortConfig !== null) {
      sortableRequests.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableRequests;
  }, [requests, sortConfig]);

  const requestSort = (key: keyof ApiRequest) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <Card className="bg-gradient-to-br from-white to-gray-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 shadow-lg border border-gray-200 dark:border-zinc-700/50 transition-all duration-300 max-w-4xl mx-auto rounded-xl overflow-hidden backdrop-blur-md">
      <CardHeader className="p-6 border-b border-gray-200 dark:border-zinc-700/50 bg-gradient-to-r from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900">
        <CardTitle className="text-2xl font-bold text-gray-800 dark:text-zinc-200">
          API Requests
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <div className="rounded-lg border border-gray-200 dark:border-zinc-700/50 overflow-hidden bg-white dark:bg-zinc-900/50 backdrop-blur-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gradient-to-r dark:from-zinc-800 dark:to-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800/50">
                <TableHead className="text-gray-600 dark:text-zinc-300 cursor-pointer" onClick={() => requestSort('endpoint')}>
                  <div className="flex items-center">
                    Endpoint
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-gray-600 dark:text-zinc-300 cursor-pointer" onClick={() => requestSort('success')}>
                  <div className="flex items-center">
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-gray-600 dark:text-zinc-300 cursor-pointer" onClick={() => requestSort('timestamp')}>
                  <div className="flex items-center">
                    Timestamp
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRequests.map(request => (
                <TableRow
                  key={request.id}
                  className="bg-white dark:bg-zinc-800/30 hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors duration-200"
                >
                  <TableCell className="font-medium text-gray-900 dark:text-zinc-300">
                    <div className="flex items-center space-x-2">
                      <span>{new URL(request.endpoint).origin}</span>
                      <a href={request.endpoint} target="_blank" rel="noopener noreferrer" className="text-blue-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-zinc-200">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`
                        ${request.success 
                          ? 'bg-green-100 dark:bg-gradient-to-r dark:from-emerald-500/20 dark:to-emerald-600/20 text-green-800 dark:text-emerald-400 border-green-300 dark:border-emerald-600' 
                          : 'bg-red-100 dark:bg-gradient-to-r dark:from-red-500/20 dark:to-red-600/20 text-red-800 dark:text-red-400 border-red-300 dark:border-red-600'}
                      `}
                    >
                      {request.success ? 'Success' : 'Failure'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500 dark:text-zinc-400">
                      {new Date(request.timestamp).toLocaleString()}
                    </span>
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

