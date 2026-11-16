import { jsonLdString } from '../lib/seo';

/** Structured data for search engines (rendered on the server, no client JS). */
export default function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(data) }} />;
}
