'use client';

import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpDown, Box, ExternalLink, Rocket } from 'lucide-react';
import axios from 'axios';
import { Skeleton } from "@/components/ui/skeleton";

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

export default function ApiRequestManager({ onRequestsChange }: ApiRequestManagerProps) {
  const [mounted, setMounted] = useState(false);
  const [requests, setRequests] = useState<ApiRequest[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof ApiRequest; direction: 'asc' | 'desc' } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchApiLogs();
  }, []);

  useEffect(() => {
    if (mounted && onRequestsChange) {
      onRequestsChange(requests);
    }
  }, [requests, mounted, onRequestsChange]);

  const fetchApiLogs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/user/getApiLogs');
      setRequests(response.data.logs);
    } catch (error) {
      console.error("Error fetching API logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sortedRequests = React.useMemo(() => {
    const sortableRequests = [...requests];
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

  const ApiRequestsSkeleton = () => (
    <div className="space-y-2">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex items-center space-x-4">
          <Skeleton className="h-4 w-full sm:w-1/3" />
          <Skeleton className="hidden sm:block h-4 w-20" />
          <Skeleton className="hidden sm:block h-4 w-1/4" />
        </div>
      ))}
    </div>
  );

  return (
    <Card className="bg-gradient-to-br from-white to-gray-100 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 shadow-lg border border-gray-200 dark:border-zinc-700/50 transition-all duration-300 w-full mx-auto rounded-xl overflow-hidden backdrop-blur-md">
      <CardHeader className="p-4 sm:p-6 border-b border-gray-200 dark:border-zinc-700/50 bg-gradient-to-r from-gray-50 to-white dark:from-zinc-800 dark:to-zinc-900">
        <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-zinc-200">
          API Requests
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        <div className="rounded-lg border border-gray-200 dark:border-zinc-700/50 overflow-x-auto bg-white dark:bg-zinc-900/50 backdrop-blur-md">
          {isLoading ? (
            <div className="p-4 sm:p-6">
              <ApiRequestsSkeleton />
            </div>
          ) : sortedRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center px-4">
              <div className="mb-4 rounded-full bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                <Rocket className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <h3 className="mb-2 text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">No API Requests Yet</h3>
              <p className="mb-6 max-w-sm text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Start making API requests to see them appear here. Your journey begins with the first call!
              </p>
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                <Box className="h-4 w-4" />
                <span>Send your first request to get started</span>
              </div>
            </div>
          ) : (
            <div className="min-w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gradient-to-r dark:from-zinc-800 dark:to-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800/50">
                    <TableHead className="text-gray-600 dark:text-zinc-300 cursor-pointer whitespace-nowrap" onClick={() => requestSort('endpoint')}>
                      <div className="flex items-center">
                        Endpoint
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-gray-600 dark:text-zinc-300 cursor-pointer whitespace-nowrap" onClick={() => requestSort('success')}>
                      <div className="flex items-center">
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-gray-600 dark:text-zinc-300 cursor-pointer whitespace-nowrap" onClick={() => requestSort('timestamp')}>
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
                      <TableCell className="font-medium text-gray-900 dark:text-zinc-300 min-w-[200px]">
                        <div className="flex items-center space-x-2">
                          <span className="truncate max-w-[150px] sm:max-w-full">{new URL(request.endpoint).origin}</span>
                          <a href={request.endpoint} target="_blank" rel="noopener noreferrer" className="text-blue-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-zinc-200 flex-shrink-0">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
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
                      <TableCell className="whitespace-nowrap">
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
                          {new Date(request.timestamp).toLocaleString()}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}