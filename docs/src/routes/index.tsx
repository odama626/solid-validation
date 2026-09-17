import MarkdownPage from '../components/MarkdownPage';
import source from '../content/v1/index.md?raw';

// `/` serves the current documented line, which is v1 today. When v2 becomes
// current this import is the single line that changes.
export default function Root() {
  return <MarkdownPage source={source} />;
}
