import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Globe, CheckCircle } from 'lucide-react'

const websites = [
  { id: 1, name: "Main Website", url: "https://example.com", status: "online" },
  { id: 2, name: "Blog", url: "https://blog.example.com", status: "offline" },
  { id: 3, name: "Store", url: "https://store.example.com", status: "online" },
  { id: 4, name: "Main Website", url: "https://example.com", status: "online" },
  { id: 5, name: "Blog", url: "https://blog.example.com", status: "offline" },
  { id: 6, name: "Store", url: "https://store.example.com", status: "online" }
]

export function WebsiteList() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Website</TableHead>
          <TableHead>URL</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {websites.map((website) => (
          <TableRow key={website.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-500" />
                {website.name}
              </div>
            </TableCell>
            <TableCell>{website.url}</TableCell>
            <TableCell>
              <Badge
                variant={website.status === "default" ? "outline" : "destructive"}
                className="flex items-center gap-1 w-fit"
              >
                {website.status === "online" && <CheckCircle className="h-3 w-3" />}
                {website.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

