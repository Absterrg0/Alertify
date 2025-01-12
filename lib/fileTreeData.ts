import { TreeViewElement } from '@/components/ui/file-tree'

export const fileTreeData: TreeViewElement[] = [
  {
    id: "1",
    name: "your-nextjs-project",
    children: [
      { id: "2", name: "package.json" },
      { id: "3", name: "next.config.js" },
      {
        id: "4",
        name: "app",
        children: [
          { id: "5", name: "layout.tsx" },
          { id: "6", name: "page.tsx" }
        ]
      },
      { id: "7", name: "public" },
      { id: "8", name: "README.md" }
    ]
  }
]

