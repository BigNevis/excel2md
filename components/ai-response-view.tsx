'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import { Button } from "./ui/Button"
import { ScrollArea } from "./ui/scroll-area"
import { Home } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Components } from 'react-markdown'

interface AIResponseViewProps {
  response: string
  onVolverAnalysis: () => void
}

export default function AIResponseView({ response, onVolverAnalysis }: AIResponseViewProps) {
  const components: Components = {
    h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-4" {...props} />,
    h2: ({node, ...props}) => <h2 className="text-2xl font-bold mb-3" {...props} />,
    h3: ({node, ...props}) => <h3 className="text-xl font-bold mb-2" {...props} />,
    p: ({node, ...props}) => <p className="mb-4" {...props} />,
    ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4" {...props} />,
    ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4" {...props} />,
    li: ({node, ...props}) => <li className="mb-1" {...props} />,
    a: ({node, ...props}) => <a className="text-blue-300 hover:underline" {...props} />,
    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-4" {...props} />,
    code: ({node, inline, ...props}) => {
      const match = /language-(\w+)/.exec(props.className || '')
      return !inline && match ? (
        <pre className="bg-gray-800 rounded p-4 overflow-x-auto mb-4">
          <code className={`language-${match[1]}`} {...props} />
        </pre>
      ) : (
        <code className="bg-gray-700 rounded px-1" {...props} />
      )
    },
    table: ({node, ...props}) => <div className="overflow-x-auto mb-4"><table className="min-w-full divide-y divide-gray-700" {...props} /></div>,
    thead: ({node, ...props}) => <thead className="bg-gray-700" {...props} />,
    th: ({node, ...props}) => <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider" {...props} />,
    td: ({node, ...props}) => <td className="px-6 py-4 whitespace-nowrap" {...props} />,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 p-4 md:p-8">
      <Card className="w-full max-w-6xl mx-auto bg-white/10 backdrop-blur-md border-none shadow-2xl">
        <CardHeader>
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={onVolverAnalysis}
            >
              <Home className="h-6 w-6" />
              <span className="sr-only">Volver al análisis</span>
            </Button>
            <CardTitle className="text-2xl md:text-3xl font-bold text-center text-white">
              Respuesta de IA
            </CardTitle>
            <div className="w-10" />
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="text-white markdown-body">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={components}
              >
                {response}
              </ReactMarkdown>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}