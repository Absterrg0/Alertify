import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, ExternalLink, CheckCircle, XCircle } from 'lucide-react'

interface Website {
  id: string
  name: string
  url: string
  status: "active" | "inactive"
  verified: boolean
}

const initialWebsites: Website[] = [
  { id: "1", name: "My Blog", url: "https://myblog.com", status: "active", verified: true },
  { id: "2", name: "Portfolio", url: "https://portfolio.com", status: "active", verified: false },
  { id: "3", name: "E-commerce Store", url: "https://mystore.com", status: "inactive", verified: true },
  { id: "4", name: "Company Website", url: "https://mycompany.com", status: "active", verified: true },
  { id: "5", name: "Personal Project", url: "https://myproject.com", status: "inactive", verified: false },
]

export function WebsiteTableStack() {
  const [websites, setWebsites] = useState<Website[]>(initialWebsites)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredWebsites = websites.filter(website =>
    website.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    website.url.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleVerify = (id: string) => {
    setWebsites(websites.map(website =>
      website.id === id ? { ...website, verified: true } : website
    ))
  }

  const handleStatusToggle = (id: string) => {
    setWebsites(websites.map(website =>
      website.id === id ? { ...website, status: website.status === "active" ? "inactive" : "active" } : website
    ))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Search className="w-5 h-5 text-gray-500" />
        <Input
          placeholder="Search websites..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Name</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWebsites.map((website) => (
              <TableRow key={website.id}>
                <TableCell className="font-medium">{website.name}</TableCell>
                <TableCell>
                  <a
                    href={website.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    {website.url}
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </a>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={website.status === "active" ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => handleStatusToggle(website.id)}
                  >
                    {website.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {website.verified ? (
                    <CheckCircle className="text-green-500 w-5 h-5" />
                  ) : (
                    <XCircle className="text-red-500 w-5 h-5" />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {!website.verified && (
                    <Button size="sm" onClick={() => handleVerify(website.id)}>
                      Verify
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

