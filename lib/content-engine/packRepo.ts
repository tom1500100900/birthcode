import enV1Pack from '@/content/packs/v1/en/pack.json';
import plV1Pack from '@/content/packs/v1/pl/pack.json';
import { ContentPack, ContentPackLocale, ContentPackSchema } from '@/lib/content-engine/packSchema';

export type PackVersion = 'v1';

const RAW_PACKS: Record<PackVersion, Record<ContentPackLocale, unknown>> = {
  v1: {
    en: enV1Pack,
    pl: plV1Pack,
  },
};

const cache = new Map<string, ContentPack>();

function describeZodError(error: unknown): string {
  const issues = (error as { issues?: Array<{ path?: Array<string | number>; message?: string }> } | null)?.issues;
  if (!Array.isArray(issues) || issues.length === 0) {
    return 'Unknown schema validation error.';
  }
  return issues
    .slice(0, 6)
    .map((issue) => `${issue.path?.join('.') ?? '(root)'}: ${issue.message ?? 'invalid value'}`)
    .join('; ');
}

export function getContentPack(locale: ContentPackLocale, version: PackVersion = 'v1'): ContentPack {
  const cacheKey = `${version}:${locale}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const raw = RAW_PACKS[version]?.[locale];
  if (!raw) {
    throw new Error(`[contentPack] missing pack for version=${version} locale=${locale}`);
  }

  try {
    const parsed = ContentPackSchema.parse(raw);
    cache.set(cacheKey, parsed);
    return parsed;
  } catch (error) {
    throw new Error(`[contentPack] invalid pack for version=${version} locale=${locale}: ${describeZodError(error)}`);
  }
}
