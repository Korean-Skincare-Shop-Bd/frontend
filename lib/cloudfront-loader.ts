import type { ImageLoaderProps } from 'next/image';

export function cloudfrontLoader({ src }: ImageLoaderProps): string {
  return src;
}
