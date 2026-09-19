import { dynamic } from '@solidjs/web';

/**
 * MDX emits every element as `<_components.h1>` where the value is the string
 * "h1". React reads a string there as an intrinsic element; Solid's compiler
 * sees a member expression and calls it as a component, which renders nothing.
 *
 * providerImportSource is the documented integration point. Solid 2's
 * `dynamic` turns a tag name into a real component, so each tag maps to one.
 */
const tags = [
  'a', 'blockquote', 'code', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'img', 'li',
  'ol', 'p', 'pre', 'strong', 'table', 'tbody', 'td', 'th', 'thead', 'tr', 'ul',
] as const;

const components = Object.fromEntries(tags.map(tag => [tag, dynamic(() => tag)]));

export function useMDXComponents(provided?: Record<string, unknown>) {
  return { ...components, ...provided };
}
