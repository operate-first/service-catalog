import { IdentityClient } from '@backstage/plugin-auth-node';
import { createRouter } from '@backstage/plugin-permission-backend';
import {
  AuthorizeResult,
  PolicyDecision,
  isResourcePermission
} from '@backstage/plugin-permission-common';
import {
  PermissionPolicy,
  PolicyQuery
} from '@backstage/plugin-permission-node';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { getRootLogger } from '@backstage/backend-common';

class TestPermissionPolicy implements PermissionPolicy {
  async handle(request: PolicyQuery): Promise<PolicyDecision> {
    getRootLogger().info(request.permission.name)
    if (request.permission.name === 'catalog.entity.read') {
      return { result: AuthorizeResult.ALLOW }
    }
    return { result: AuthorizeResult.DENY };
  }
}

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    config: env.config,
    logger: env.logger,
    discovery: env.discovery,
    policy: new TestPermissionPolicy(),
    identity: IdentityClient.create({
      discovery: env.discovery,
      issuer: await env.discovery.getExternalBaseUrl('auth'),
    }),
  });
}
