import MarkdownPage from '../../components/MarkdownPage';
import source from '../../content/v1/index.md?raw';

export default function Page() {
  return <MarkdownPage source={source} />;
}
