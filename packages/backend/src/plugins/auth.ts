import {
  createRouter,
  providers,
  defaultAuthProviderFactories,
} from '@backstage/plugin-auth-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    discovery: env.discovery,
    tokenManager: env.tokenManager,
    providerFactories: {
      ...defaultAuthProviderFactories,
      // See the auth documentation for more details on how to enable
      // and customize sign-in:
      //
      // https://backstage.io/docs/auth/identity-resolver
      github: providers.github.create({
        // Authenticate everyone as a guest
        signIn: {
          resolver: async (_, ctx) => {
            const userRef = 'user:default/guest';
            return ctx.issueToken({
              claims: {
                sub: userRef,
                ent: [userRef],
              },
            });
          },
        },
      }),
    },
  });
}
