import { useHotCleanup } from '@backstage/backend-common';
import { createRouter } from '@backstage/plugin-search-backend';
import {
  IndexBuilder,
  LunrSearchEngine,
} from '@backstage/plugin-search-backend-node';
import { PluginEnvironment } from '../types';
import { DefaultCatalogCollatorFactory } from '@backstage/plugin-catalog-backend';
import { DefaultTechDocsCollatorFactory } from '@backstage/plugin-techdocs-backend';
import { DefaultAdrCollatorFactory } from '@backstage/plugin-adr-backend';
import { Router } from 'express';
import { PgSearchEngine } from '@backstage/plugin-search-backend-module-pg';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  // Initialize a connection to a search engine.
  const searchEngine = (await PgSearchEngine.supported(env.database))
    ? await PgSearchEngine.fromConfig(env.config, { database: env.database })
    : new LunrSearchEngine({ logger: env.logger });

  const indexBuilder = new IndexBuilder({
    logger: env.logger,
    searchEngine,
  });

  const schedule = env.scheduler.createScheduledTaskRunner({
    frequency: { minutes: 10 },
    timeout: { minutes: 15 },
    initialDelay: { seconds: env.config.getNumber('searchInitialDelay') },
  });

  // Collators are responsible for gathering documents known to plugins. This
  // collator gathers entities from the software catalog.
  indexBuilder.addCollator({
    schedule,
    factory: DefaultCatalogCollatorFactory.fromConfig(env.config, {
      discovery: env.discovery,
      tokenManager: env.tokenManager,
    }),
  });

  // collator gathers entities from techdocs.
  indexBuilder.addCollator({
    schedule,
    factory: DefaultTechDocsCollatorFactory.fromConfig(env.config, {
      discovery: env.discovery,
      logger: env.logger,
      tokenManager: env.tokenManager,
    }),
  });

  indexBuilder.addCollator({
    schedule,
    factory: DefaultAdrCollatorFactory.fromConfig({
      cache: env.cache,
      config: env.config,
      discovery: env.discovery,
      logger: env.logger,
      reader: env.reader,
      tokenManager: env.tokenManager,
      adrFilePathFilterFn: (path: string) =>
        path === 'template.md' ? false : /^(adrs?\/)?\d{4}-.+\.md$/.test(path),
    }),
  });

  // The scheduler controls when documents are gathered from collators and sent
  // to the search engine for indexing.
  const { scheduler } = await indexBuilder.build();
  scheduler.start();

  useHotCleanup(module, () => scheduler.stop());

  return await createRouter({
    engine: indexBuilder.getSearchEngine(),
    types: indexBuilder.getDocumentTypes(),
    permissions: env.permissions,
    config: env.config,
    logger: env.logger,
  });
}
