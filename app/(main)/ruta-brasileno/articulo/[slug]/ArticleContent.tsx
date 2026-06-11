'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  content: string
}

export function ArticleContent({ content }: Props) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h2: ({ children }) => (
          <h2 className="text-xl font-black text-gray-900 mt-8 mb-3 first:mt-0">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-base font-bold text-gray-900 mt-5 mb-2">{children}</h3>
        ),
        p: ({ children }) => (
          <p className="text-gray-700 leading-relaxed mb-4 last:mb-0">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="space-y-1.5 mb-4 ml-1">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="space-y-1.5 mb-4 ml-1 list-decimal list-inside">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="flex items-start gap-2 text-gray-700 text-sm leading-relaxed">
            <span className="text-[#009C3B] mt-1 shrink-0">•</span>
            <span>{children}</span>
          </li>
        ),
        strong: ({ children }) => (
          <strong className="font-bold text-gray-900">{children}</strong>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#002776] underline underline-offset-2 hover:text-[#002776]/70 transition-colors"
          >
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-[#002776]/20 pl-4 my-4 text-gray-600 italic">
            {children}
          </blockquote>
        ),
        hr: () => <hr className="my-6 border-gray-100" />,
        code: ({ children }) => (
          <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
