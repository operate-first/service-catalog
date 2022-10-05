import React from 'react';
import { Entity } from '@backstage/catalog-model';
import { EntityTechdocsContent } from '@backstage/plugin-techdocs';
import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
import { ReportIssue } from '@backstage/plugin-techdocs-module-addons-contrib';

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

export const techdocsContent = (
  <EntityTechdocsContent>
    <TechDocsAddons>
      <ReportIssue />
    </TechDocsAddons>
  </EntityTechdocsContent>
);
