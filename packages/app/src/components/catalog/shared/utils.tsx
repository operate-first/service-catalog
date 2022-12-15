import { Entity } from '@backstage/catalog-model';

export const hasLinks = (entity: Entity) =>
  Boolean(entity?.metadata?.links?.length);

export const isType = (types: string | string[]) => (entity: Entity) => {
  if (!entity?.spec?.type) {
    return false;
  }
  return typeof types === 'string'
    ? entity?.spec?.type === types
    : types.includes(entity.spec.type as string);
};

export const adrFilePathFilter = (path: string) =>
  path === 'template.md' ? false : /^(adrs?\/)?\d{4}-.+\.md$/.test(path);
