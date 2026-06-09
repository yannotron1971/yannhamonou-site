import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

export const reader = createReader(process.cwd(), keystaticConfig);

export type Post = Awaited<ReturnType<typeof reader.collections.posts.read>>;
export type PostEntry = Awaited<ReturnType<typeof reader.collections.posts.all>>[number];
