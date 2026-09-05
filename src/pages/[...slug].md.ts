import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

// Serves each doc's Markdown source, for the header's copy-as-Markdown button.
export async function getStaticPaths() {
	const docs = await getCollection('docs');
	return docs.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}

// ponytail: raw source with import lines stripped. The four .mdx pages still leak
// their component tags (<Term …/>, <Keys />) into the copy — swap to a real
// MDX-to-Markdown render only if that turns out to bite.
export const GET: APIRoute = ({ props }) =>
	new Response((props.entry.body ?? '').replace(/^import .*$\n?/gm, ''), {
		headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
	});
