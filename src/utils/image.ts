import { LEGACY_IMAGE_PATH, PUBLIC_IMAGE_PATH } from '../constants/images';

/**
 * Maps a legacy bundled image path (/src/assets/images/...) to its public
 * equivalent (/images/...). Returns null when there is nothing to fall back to.
 */
export const getFallbackImageSrc = (src: string): string | null =>
  src.startsWith(LEGACY_IMAGE_PATH) ? PUBLIC_IMAGE_PATH + src.replace(LEGACY_IMAGE_PATH, '') : null;
