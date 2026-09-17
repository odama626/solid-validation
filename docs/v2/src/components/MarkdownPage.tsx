import { Title } from '@solidjs/meta';
import MarkdownIt from 'markdown-it';
import { For, Show } from 'solid-js';
import Demo from './Demo';

const md = MarkdownIt({ html: true, linkify: true });

const demoTitles: Record<string, string> = {
  basic: 'A form with native and custom validation',
  async: 'A field validated by an async availability check',
  server: 'A form that receives errors back from the server',
  outside: 'A non-input element validated without a form',
  child: 'A field registered from inside a child component',
};

type Block = { kind: 'html'; value: string } | { kind: 'demo'; value: string };

/**
 * Pages stay as markdown so prose can be edited as prose. Demos are marked in
 * the source with `:::demo <name>:::` and spliced back in as real components,
 * which is the one thing raw HTML cannot carry.
 */
function parse(source: string) {
  let body = source;
  let title = '';

  const frontmatter = /^---\n(.*?)\n---\n/s.exec(body);
  if (frontmatter) {
    title = (/^title:\s*(.+)$/m.exec(frontmatter[1])?.[1] ?? '').trim();
    body = body.slice(frontmatter[0].length);
  }

  const blocks: Block[] = [];
  const pattern = /^:::demo\s+(\S+):::$/gm;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(body))) {
    const chunk = body.slice(last, match.index);
    if (chunk.trim()) blocks.push({ kind: 'html', value: md.render(chunk) });
    blocks.push({ kind: 'demo', value: match[1] });
    last = match.index + match[0].length;
  }

  const tail = body.slice(last);
  if (tail.trim()) blocks.push({ kind: 'html', value: md.render(tail) });

  return { title, blocks };
}

export default function MarkdownPage(props: { source: string }) {
  const page = () => parse(props.source);

  return (
    <>
      <Show when={page().title}>
        <Title>{page().title} - solid-validation</Title>
        {/* The title lives in frontmatter, not as a heading in the body. */}
        <h1>{page().title}</h1>
      </Show>
      <For each={page().blocks}>
        {block =>
          block.kind === 'demo' ? (
            <Demo name={block.value} title={demoTitles[block.value] ?? 'Live demo'} />
          ) : (
            <div innerHTML={block.value} />
          )
        }
      </For>
    </>
  );
}
