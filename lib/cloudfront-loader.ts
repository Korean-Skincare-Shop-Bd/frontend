import type { ImageLoaderProps } from 'next/image';

export function cloudfrontLoader({ src, width }: ImageLoaderProps): string {
  const sep = src.includes('?') ? '&' : '?';
  return `${src}${sep}w=${width}`;
}
