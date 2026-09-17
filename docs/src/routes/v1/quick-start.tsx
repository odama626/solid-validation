import MarkdownPage from '../../components/MarkdownPage';
import source from '../../content/v1/quick-start.md?raw';

export default function Page() {
  return <MarkdownPage source={source} />;
}
