import fg from 'fast-glob'
import { readFileSync, existsSync, statSync, exists } from 'fs'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const markdownLinkExtractor = require('markdown-link-extractor')
import { join, dirname, resolve } from 'path'

interface MarkdownLink {
  href: string
  text: string
}

function isRelativeLink(link: string) {
  return (
    link &&
    !link.startsWith('http://') &&
    !link.startsWith('https://') &&
    !link.startsWith('//') &&
    !link.startsWith('#')
  )
}

function fileExistsForLink(link: string, markdownFile: string): boolean {
  // Remove hash if present
  const filePart = link.split('#')[0]
  // If the link is empty after removing hash, it's not a file
  if (!filePart) return false

  // Resolve the path relative to the markdown file's directory
  let absPath = resolve(markdownFile, filePart)

  // Check if this is an example path
  const isExample = absPath.includes('/examples/')

  let exists = false
  
  if (isExample) {
    // Transform /docs/framework/{framework}/examples/ to /examples/{framework}/
    absPath = absPath.replace(/\/docs\/framework\/([^/]+)\/examples\//, '/examples/$1/')
    // For examples, we want to check if the directory exists
     exists = existsSync(absPath) && statSync(absPath).isDirectory()
  } else {
    // For non-examples, we want to check if the .md file exists
    if (!absPath.endsWith('.md')) {
      absPath = `${absPath}.md`
    }
    exists = existsSync(absPath)
  }

  if (exists) {
      // console.log(`✅  ${absPath} (directory)`)
    } else {
      console.log(`❌  ${absPath} (directory not found)`)
    }
    return exists
}

async function findMarkdownLinks() {
  // Find all markdown files in docs directory
  const markdownFiles = await fg('docs/**/*.md', {
    ignore: ['**/node_modules/**'],
  })

  console.log(`Found ${markdownFiles.length} markdown files\n`)

  // Process each file
  for (const file of markdownFiles) {
    const content = readFileSync(file, 'utf-8')
    const links: any[] = markdownLinkExtractor(content)

    const filteredLinks = links.filter((link: any) => {
      if (typeof link === 'string') {
        return isRelativeLink(link)
      } else if (link && typeof link.href === 'string') {
        return isRelativeLink(link.href)
      }
      return false
    })

    if (filteredLinks.length > 0) {
      console.log(`\nRelative links in ${file}:`)
      filteredLinks.forEach((link: any) => {
        const href = typeof link === 'string' ? link : link.href
        fileExistsForLink(href, file)
      })
    }
  }
}

findMarkdownLinks().catch(console.error)
