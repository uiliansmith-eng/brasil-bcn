function parseMarkdown(md: string): string {
  return md
    // h3 before h2 to avoid partial matches
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-bold text-gray-900 mt-5 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-black text-gray-900 mt-8 mb-3 first:mt-0">$1</h2>')
    // bold
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
    // hr
    .replace(/^---$/gm, '<hr class="my-6 border-gray-100" />')
    // blockquotes (must come before paragraph rule)
    .replace(/^> \*\*(.+?)\*\*(.*)$/gm, '<div class="border-l-4 border-[#009C3B] bg-green-50 rounded-r-xl px-4 py-3 mb-4"><p class="font-bold text-green-800 text-sm mb-0.5">$1</p><p class="text-green-700 text-sm">$2</p></div>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-[#002776]/25 bg-blue-50/60 rounded-r-xl px-4 py-3 mb-4 text-sm text-gray-600 italic leading-relaxed">$1</blockquote>')
    // unordered list items
    .replace(/^- (.+)$/gm, '<li class="flex items-start gap-2 text-gray-700 text-sm leading-relaxed"><span class="text-[#009C3B] mt-1 shrink-0">•</span><span>$1</span></li>')
    // wrap consecutive <li> in <ul>
    .replace(/(<li[\s\S]+?<\/li>\n?)+/g, (match) => `<ul class="space-y-1.5 mb-4 ml-1">${match}</ul>`)
    // links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#002776] underline underline-offset-2 hover:opacity-70 transition-opacity">$1</a>')
    // paragraphs: blank-line-separated text blocks not already wrapped in a tag
    .replace(/^(?!<[hbud]|<\/[hbud]|<hr|<bl)(.+)$/gm, '<p class="text-gray-700 leading-relaxed mb-4">$1</p>')
    // clean up empty paragraphs from blank lines
    .replace(/<p class="[^"]*"><\/p>/g, '')
    // remove stray blank lines between block elements
    .replace(/\n{2,}/g, '\n')
}

interface Props {
  content: string
}

export function ArticleContent({ content }: Props) {
  const html = parseMarkdown(content)
  return (
    <div
      className="article-body"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
