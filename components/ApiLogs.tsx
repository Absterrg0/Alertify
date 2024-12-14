'use client';

import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
  
  useEffect(() => {
    setMounted(true);
    const data = initialData || defaultRequests;
    setRequests(data);
    
    if (mounted && onRequestsChange) {
      onRequestsChange(requests);
    }
  }, [initialData, mounted, onRequestsChange]);

  const filteredRequests = requests.map(request => ({
    ...request,
    endpoint: new URL(request.endpoint).origin
  }));

  return (
    <Card className="bg-gradient-to-b from-gray-900 to-gray-800 shadow-lg border border-gray-700/50 transition-all duration-300 max-w-3xl mx-auto rounded-lg overflow-hidden backdrop-blur-md">
      <CardHeader className="p-6 border-b bg-gradient-to-r from-gray-800 to-gray-700 text-white">
        <h2 className="text-2xl font-semibold">API Requests</h2>
      </CardHeader>

      <CardContent className="p-6">
        <div className="rounded-lg border border-gray-700/50 overflow-hidden bg-white/20 dark:bg-gray-800/20 backdrop-blur-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                <TableHead>Endpoint</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map(request => (
                <TableRow
                  key={request.id}
                  className={`
                    transition-colors duration-200
                  `}
                >
                  <TableCell>{request.endpoint}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`
                        ${request.success 
                          ? 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' 
                          : 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800'}
                      `}
                    >
                      {request.success ? 'Success' : 'Failure'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-400">
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
