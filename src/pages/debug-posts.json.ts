import type { APIRoute } from 'astro';
import { reader } from '../lib/keystatic';
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

export const GET: APIRoute = async () => {
  try {
    const cwd = process.cwd();

    // Check if content/posts directory exists
    let dirContents: string[] = [];
    try {
      dirContents = await readdir(join(cwd, 'content', 'posts'));
    } catch (e) {
      dirContents = [`Error reading dir: ${e}`];
    }

    const slugs = await reader.collections.posts.list();

    // Try a fresh reader
    const freshReader = createReader(cwd, keystaticConfig);
    const freshSlugs = await freshReader.collections.posts.list();

    return new Response(JSON.stringify({
      cwd,
      dirContents,
      readerSlugs: slugs,
      freshReaderSlugs: freshSlugs,
    }, null, 2), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e), stack: String((e as Error).stack) }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const prerender = false;
