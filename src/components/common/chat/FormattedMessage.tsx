import React, { useEffect, useRef, type JSX } from 'react';
import katex from 'katex';

interface SafeMathProps {
  formula: string;
  inline?: boolean;
}

export const SafeMath: React.FC<SafeMathProps> = ({ formula, inline = true }) => {
  const containerRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        // Clean formula: sometimes LLMs output HTML-encoded characters
        const cleanFormula = formula
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .trim();

        katex.render(cleanFormula, containerRef.current, {
          displayMode: !inline,
          throwOnError: false,
          trust: true,
        });
      } catch (err) {
        console.error('KaTeX rendering error:', err);
        containerRef.current.textContent = inline ? `$${formula}$` : `$$${formula}$$`;
      }
    }
  }, [formula, inline]);

  return (
    <span
      ref={containerRef}
      className={
        inline
          ? "inline-block px-1 font-mono text-[13px] text-indigo-300"
          : "block my-3 overflow-x-auto max-w-full py-2 px-3 bg-surface-overlay/50 rounded-lg border border-surface-border/30 scroll-area text-center"
      }
    />
  );
};

interface FormattedMessageProps {
  text: string;
  showReferences?: boolean;
}

export const FormattedMessage: React.FC<FormattedMessageProps> = ({ text, showReferences = true }) => {
  if (!text) return null;

  // First, split block math ($$...$$) from regular markdown blocks
  const parts = text.split('$$');
  const blocks: React.ReactNode[] = [];

  parts.forEach((part, index) => {
    if (index % 2 !== 0) {
      // This is a display math block
      blocks.push(
        <div
          key={`block-math-${index}`}
          className="flex justify-center my-4 overflow-x-auto w-full scroll-area"
        >
          <SafeMath formula={part} inline={false} />
        </div>
      );
    } else {
      // This is standard markdown text, which can have multiple lines (lists, headers, etc.)
      blocks.push(...parseMarkdownBlocks(part, index, showReferences));
    }
  });

  return <div className="space-y-1.5 text-text-secondary">{blocks}</div>;
};

// Parses inline Markdown: bold, italic, code, inline math, and chunk citations
function parseInline(text: string, showReferences: boolean): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let i = 0;
  let textBuffer = '';

  const flushTextBuffer = () => {
    if (textBuffer) {
      const decoded = textBuffer
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
      nodes.push(<span key={`text-${i}-${textBuffer.substring(0, 5)}`}>{decoded}</span>);
      textBuffer = '';
    }
  };

  while (i < text.length) {
    const sub = text.slice(i);

    // 1. Chunk citations like [CHUNK:4] or [Chunk 4] or [CHUNK: 4]
    const chunkMatch = sub.match(/^\[CHUNK:\s*(\d+)\]/i) || sub.match(/^\[Chunk\s+(\d+)\]/i);
    if (chunkMatch) {
      flushTextBuffer();
      const chunkId = chunkMatch[1];
      if (showReferences) {
        nodes.push(
          <sup
            key={`chunk-${i}`}
            className="text-[10.5px] font-mono font-semibold text-text-tertiary hover:text-indigo-400 cursor-pointer select-none px-0.5 transition-colors align-super"
            title={`Source Document Chunk ${chunkId}`}
            onClick={(e) => {
              e.stopPropagation();
              const event = new CustomEvent('highlight-chunk', { detail: { chunkId } });
              window.dispatchEvent(event);
            }}
          >
            [{chunkId}]
          </sup>
        );
      }
      i += chunkMatch[0].length;
      continue;
    }

    // 2. Bold elements: **text** or <b>text</b> or <strong>text</strong>
    const boldMatch =
      sub.match(/^\*\*([^*]+)\*\*/) ||
      sub.match(/^<(?:b|strong)>([\s\S]*?)<\/(?:b|strong)>/i);
    if (boldMatch) {
      flushTextBuffer();
      nodes.push(
        <strong key={`bold-${i}`} className="font-semibold text-text-primary text-[14.5px]">
          {parseInline(boldMatch[1], showReferences)}
        </strong>
      );
      i += boldMatch[0].length;
      continue;
    }

    // 3. Italic elements: *text* or _text_
    const italicMatch = sub.match(/^\*([^*]+)\*/) || sub.match(/^_(^_*)_/);
    if (italicMatch) {
      flushTextBuffer();
      nodes.push(
        <em key={`italic-${i}`} className="italic text-text-secondary/90">
          {parseInline(italicMatch[1], showReferences)}
        </em>
      );
      i += italicMatch[0].length;
      continue;
    }

    // 4. Inline code: `code`
    const codeMatch = sub.match(/^`([^`]+)`/);
    if (codeMatch) {
      flushTextBuffer();
      nodes.push(
        <code
          key={`code-${i}`}
          className="px-1.5 py-0.5 rounded bg-surface-overlay border border-surface-border text-indigo-300 font-mono text-[12.5px]"
        >
          {codeMatch[1]}
        </code>
      );
      i += codeMatch[0].length;
      continue;
    }

    // 5. Inline Math: $formula$ (must not match lonely dollars like $100)
    const mathMatch = sub.match(/^\$([^$]+)\$/);
    if (mathMatch) {
      flushTextBuffer();
      nodes.push(
        <SafeMath key={`math-${i}`} formula={mathMatch[1]} inline={true} />
      );
      i += mathMatch[0].length;
      continue;
    }

    // Otherwise, accumulate regular characters
    textBuffer += text[i];
    i++;
  }

  flushTextBuffer();
  return nodes;
}

interface RawListItem {
  type: 'ul' | 'ol';
  indent: number;
  content: React.ReactNode[];
  key: string;
}

interface ListTreeNode {
  type: 'ul' | 'ol';
  indent: number;
  items: {
    content: React.ReactNode[];
    key: string;
    children: ListTreeNode[];
  }[];
}

function renderNestedLists(items: RawListItem[]): React.ReactNode[] {
  if (items.length === 0) return [];

  const roots: ListTreeNode[] = [];
  const stack: ListTreeNode[] = [];

  for (const item of items) {
    // Find the right parent/level
    while (stack.length > 0 && stack[stack.length - 1].indent > item.indent) {
      stack.pop();
    }

    if (stack.length === 0) {
      // Create a new root list
      const newRoot: ListTreeNode = {
        type: item.type,
        indent: item.indent,
        items: [{ content: item.content, key: item.key, children: [] }]
      };
      roots.push(newRoot);
      stack.push(newRoot);
    } else {
      const parentList = stack[stack.length - 1];
      if (item.indent > parentList.indent) {
        // Create a nested list under the last item of parentList
        const lastItem = parentList.items[parentList.items.length - 1];
        const newList: ListTreeNode = {
          type: item.type,
          indent: item.indent,
          items: [{ content: item.content, key: item.key, children: [] }]
        };
        lastItem.children.push(newList);
        stack.push(newList);
      } else {
        // Same indent level
        if (parentList.type === item.type) {
          parentList.items.push({ content: item.content, key: item.key, children: [] });
        } else {
          // Different type at same level -> close this one and create a new list
          stack.pop();
          if (stack.length === 0) {
            const newRoot: ListTreeNode = {
              type: item.type,
              indent: item.indent,
              items: [{ content: item.content, key: item.key, children: [] }]
            };
            roots.push(newRoot);
            stack.push(newRoot);
          } else {
            const grandParent = stack[stack.length - 1];
            const lastItem = grandParent.items[grandParent.items.length - 1];
            const newList: ListTreeNode = {
              type: item.type,
              indent: item.indent,
              items: [{ content: item.content, key: item.key, children: [] }]
            };
            lastItem.children.push(newList);
            stack.push(newList);
          }
        }
      }
    }
  }

  // Now, render the tree recursively
  function renderNode(node: ListTreeNode): React.ReactNode {
    const renderedItems = node.items.map((item) => {
      const nested = item.children.map((child, idx) => (
        <React.Fragment key={`nested-${item.key}-${idx}`}>
          {renderNode(child)}
        </React.Fragment>
      ));
      return (
        <li key={`li-${item.key}`} className="text-text-secondary leading-relaxed pl-1 text-[14px]">
          {item.content}
          {nested}
        </li>
      );
    });

    if (node.type === 'ul') {
      return (
        <ul key={`ul-${node.items[0].key}`} className="list-disc pl-6 my-1 space-y-1">
          {renderedItems}
        </ul>
      );
    } else {
      return (
        <ol key={`ol-${node.items[0].key}`} className="list-decimal pl-6 my-1 space-y-1">
          {renderedItems}
        </ol>
      );
    }
  }

  return roots.map((root) => renderNode(root));
}

// Parses block structures line-by-line: headers, bullet lists, numbered lists, blockquotes, paragraphs
function parseMarkdownBlocks(text: string, blockIndex: number, showReferences: boolean): React.ReactNode[] {
  const lines = text.split('\n');
  const lineNodes: React.ReactNode[] = [];
  let consecutiveListItems: RawListItem[] = [];

  const flushConsecutiveLists = () => {
    if (consecutiveListItems.length > 0) {
      lineNodes.push(...renderNestedLists(consecutiveListItems));
      consecutiveListItems = [];
    }
  };

  for (let j = 0; j < lines.length; j++) {
    const line = lines[j];
    const trimmed = line.trim();

    // 1. Unordered List Items: starts with *, -, or + followed by a space
    const ulMatch = line.match(/^(\s*)[*+-]\s+(.*)$/);
    if (ulMatch) {
      const indentDepth = ulMatch[1].replace(/\t/g, '    ').length;
      consecutiveListItems.push({
        type: 'ul',
        indent: indentDepth,
        content: parseInline(ulMatch[2], showReferences),
        key: `${blockIndex}-${j}`
      });
      continue;
    }

    // 2. Ordered List Items: starts with a number followed by . and a space
    const olMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);
    if (olMatch) {
      const indentDepth = olMatch[1].replace(/\t/g, '    ').length;
      consecutiveListItems.push({
        type: 'ol',
        indent: indentDepth,
        content: parseInline(olMatch[2], showReferences),
        key: `${blockIndex}-${j}`
      });
      continue;
    }

    // Non-list line matches: first flush any active list buffer
    flushConsecutiveLists();

    // 3. Headers: #, ##, ###
    const headerMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      const content = headerMatch[2];
      const Tag = `h${level}` as keyof JSX.IntrinsicElements;
      const classes =
        level === 1
          ? 'text-xl font-bold text-text-primary mt-4 mb-2 border-b border-surface-border/30 pb-1'
          : level === 2
          ? 'text-lg font-semibold text-text-primary mt-3.5 mb-1.5'
          : 'text-base font-semibold text-text-primary mt-3 mb-1';

      lineNodes.push(
        <Tag key={`h-${blockIndex}-${j}`} className={classes}>
          {parseInline(content, showReferences)}
        </Tag>
      );
      continue;
    }

    // 4. Blockquotes: >
    if (trimmed.startsWith('>')) {
      const content = trimmed.substring(1).trim();
      lineNodes.push(
        <blockquote
          key={`bq-${blockIndex}-${j}`}
          className="pl-3.5 border-l-2 border-indigo-500/50 italic text-text-secondary/80 my-2 bg-indigo-500/5 py-1 px-2 rounded-r"
        >
          {parseInline(content, showReferences)}
        </blockquote>
      );
      continue;
    }

    // 5. Empty lines
    if (trimmed === '') {
      if (j > 0 && j < lines.length - 1 && lines[j - 1].trim() !== '') {
        lineNodes.push(<div key={`br-${blockIndex}-${j}`} className="h-2" />);
      }
      continue;
    }

    // 6. Standard Paragraph
    lineNodes.push(
      <p key={`p-${blockIndex}-${j}`} className="text-text-secondary leading-relaxed text-[14px] mb-1.5">
        {parseInline(line, showReferences)}
      </p>
    );
  }

  // Flush any final list left in buffer
  flushConsecutiveLists();

  return lineNodes;
}
