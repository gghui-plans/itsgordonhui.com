/**
 * Article post-processing for Insights pages.
 *
 * Three jobs, none of which touch the source Markdown:
 *   1. Stable anchor IDs on the three decision headings and the two detachable
 *      forms, so they can be linked and quoted independently of heading numbering.
 *   2. Every table wrapped in a scroll container, so wide tables scroll inside
 *      themselves and never make the page scroll sideways.
 *   3. The two detachable forms wrapped in a styled section, identified by the
 *      HTML comment markers carried in the source file.
 */

const STABLE_IDS = [
  [/^\s*5\.\s*Decision 1: Investigate\s*$/i, 'decision-1-investigate'],
  [/^\s*6\.\s*Decision 2: Apply\s*$/i, 'decision-2-apply'],
  [/^\s*7\.\s*Decision 3: Accept\s*$/i, 'decision-3-accept'],
  [/^\s*Municipal Grant Decision Summary\s*$/i, 'decision-summary'],
  [/^\s*Municipal Grant Award Acceptance and Accountability Worksheet\s*$/i, 'acceptance-worksheet'],
];

const HEADINGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

function textOf(node) {
  if (node.type === 'text') return node.value;
  if (!node.children) return '';
  return node.children.map(textOf).join('');
}

/** Marker text from a comment node, whichever shape the pipeline produced. */
function markerOf(node) {
  let value = null;
  if (node.type === 'comment') value = node.value;
  else if (node.type === 'raw' && typeof node.value === 'string') {
    const match = node.value.match(/^\s*<!--([\s\S]*?)-->\s*$/);
    if (match) value = match[1];
  }
  if (value === null) return null;
  const match = value.match(/\s*(BEGIN|END) DETACHABLE PAGE (\d+)\s*/i);
  return match ? { edge: match[1].toUpperCase(), page: match[2] } : null;
}

export function rehypeArticle() {
  return (tree) => {
    // 1 and 2: stable IDs and table wrapping, anywhere in the tree.
    const walk = (node) => {
      if (!node.children) return;
      for (let i = 0; i < node.children.length; i += 1) {
        const child = node.children[i];

        if (child.type === 'element' && HEADINGS.has(child.tagName)) {
          const text = textOf(child);
          for (const [pattern, id] of STABLE_IDS) {
            if (pattern.test(text)) {
              child.properties = { ...child.properties, id };
              break;
            }
          }
        }

        if (child.type === 'element' && child.tagName === 'table') {
          node.children[i] = {
            type: 'element',
            tagName: 'div',
            properties: { className: ['table-scroll'], tabIndex: 0, role: 'region' },
            children: [child],
          };
          continue;
        }

        walk(child);
      }
    };
    walk(tree);

    // 3: wrap each detachable form in its own section.
    const out = [];
    let buffer = null;

    for (const node of tree.children) {
      const marker = markerOf(node);

      if (marker && marker.edge === 'BEGIN') {
        buffer = { page: marker.page, children: [] };
        continue;
      }

      if (marker && marker.edge === 'END' && buffer) {
        out.push({
          type: 'element',
          tagName: 'section',
          properties: {
            className: ['detachable'],
            id: `detachable-page-${buffer.page}`,
            'aria-label': `Detachable form ${buffer.page}`,
          },
          children: buffer.children,
        });
        buffer = null;
        continue;
      }

      if (buffer) buffer.children.push(node);
      else out.push(node);
    }

    // An unclosed marker must not swallow content.
    if (buffer) out.push(...buffer.children);

    tree.children = out;
  };
}

export default rehypeArticle;
