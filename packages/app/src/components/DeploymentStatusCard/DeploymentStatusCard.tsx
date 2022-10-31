import {
  Progress,
  StatusAborted,
  StatusError,
  StatusOK,
  StatusPending,
  StatusWarning,
} from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import {
  detectErrors,
  useKubernetesObjects,
} from '@backstage/plugin-kubernetes';
import { Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import StatusCard from '../catalog/shared/StatusCard';

type Phase = {
  running: number;
  pending: number;
  succeeded: number;
  failed: number;
  unknown: number;
  hasError: number;
};

const Status = ({ pods }: { pods: Phase }) => {
  if (pods.failed) {
    return <StatusError />;
  }
  if (pods.hasError) {
    return <StatusWarning />;
  }
  if (pods.pending) {
    return <StatusPending />;
  }
  if (pods.running) {
    return <StatusOK />;
  }
  return <StatusAborted />;
};

const DeploymentStatusCard = () => {
  const { entity } = useEntity();
  const [pods, setPods] = useState({} as Phase);

  const { kubernetesObjects, error } = useKubernetesObjects(entity, 30000);

  useEffect(() => {
    if (!kubernetesObjects || kubernetesObjects?.items.length === 0) {
      return;
    }

    const newPods = kubernetesObjects.items
      .flatMap(item =>
        item.resources
          .filter(resource => resource.type === 'pods')
          .flatMap(resource => resource.resources),
      )
      .reduce((acc, v) => {
        const phase = (v.status.phase as string).toLowerCase();
        return {
          ...acc,
          [phase]: acc[phase] + 1,
        };
      }, new Proxy({} as Phase, { get: (t, n) => (t.hasOwnProperty(n) ? (t as any)[n] : 0) }));

    newPods.hasError = new Set(
      kubernetesObjects.items
        .flatMap(item =>
          detectErrors(kubernetesObjects).get(item.cluster.name),
        )
        ?.filter(de => de?.kind === 'Pod')
        .map(de => de?.names)
        .flat() ?? [],
    ).size;

    setPods(newPods);
  }, [kubernetesObjects, error]);

  const pluralizeBe = (count: number) => (count === 1 ? ' is' : 's are');
  const pluralizeHave = (count: number) => (count === 1 ? ' has' : 's have');

  return (
    <StatusCard
      title="Deployment"
      deepLink={{ title: 'View more', link: 'kubernetes' }}
    >
      {kubernetesObjects === undefined ? (
        <Progress />
      ) : (
        <>
          <Typography variant="h1" component="div">
            <Status pods={pods} />
          </Typography>
          <Typography variant="subtitle2" component="div">
            {pods.running
              ? `${pods.running} pod${pluralizeBe(pods.running)} running`
              : 'No pods running'}
          </Typography>
          {pods.running > 0 || pods.pending > 0 && (
            <Typography variant="subtitle2" component="div">
              ({pods.hasError || 0} pod{pluralizeBe(pods.hasError)} reporting
              errors)
            </Typography>
          )}
          {pods.failed > 0 && (
            <Typography variant="subtitle2" component="div">
              ({pods.failed} pod{pluralizeHave(pods.failed)} failed)
            </Typography>
          )}
        </>
      )}
    </StatusCard>
  );
};

export default DeploymentStatusCard;
