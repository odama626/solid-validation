import MarkdownPage from '../../components/MarkdownPage';
import source from '../../content/v1/troubleshooting.md?raw';

export default function Page() {
  return <MarkdownPage source={source} />;
}
