import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
import { ManagedClusterProvider } from '@internal/backstage-plugin-rhacm-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
  const rhacm = ManagedClusterProvider.fromConfig(env.config, {
    logger: env.logger,
  });
  builder.addProcessor(new ScaffolderEntitiesProcessor());
  builder.addEntityProvider(rhacm);
  const { processingEngine, router } = await builder.build();
  await processingEngine.start();

  await env.scheduler.scheduleTask({
    id: 'run_rhacm_refresh',
    fn: async () => {
      await rhacm.run();
    },
    frequency: { minutes: 30 },
    timeout: { minutes: 10 },
  });

  return router;
}
