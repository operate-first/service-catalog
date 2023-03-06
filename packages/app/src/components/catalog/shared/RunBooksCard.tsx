import {
  InfoCard,
  MarkdownContent,
  Progress,
} from '@backstage/core-components';
import { Grid } from '@material-ui/core';
import { EntityPrometheusAlertCard } from '@roadiehq/backstage-plugin-prometheus';
import React, { useEffect } from 'react';
import { useState } from 'react';

type AlertData = {
  name: string;
  annotations: {
    runbook_url: string;
  };
};

const convertGithubUrlToRaw = (url: string) =>
  url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');

export const RunBooksCard = () => {
  const [alertData, setAlertData] = useState<AlertData>();
  const [runbook, setRunbook] = useState<string>();
  const [loading, setLoading] = useState(false);

  const getRunbook = (runbookUrl: string) => {
    setLoading(true);
    fetch(runbookUrl)
      .then(res => res.text())
      .then(text => setRunbook(text))
      .finally(() => setLoading(false));
  };
  const getAlertData = (arg: any) => {
    setAlertData(arg);
  };

  useEffect(() => {
    if (alertData?.annotations.runbook_url) {
      const url = alertData.annotations.runbook_url;
      getRunbook(
        new URL(url).hostname === 'github.com'
          ? convertGithubUrlToRaw(url)
          : url,
      );
    }
  }, [alertData]);

  return (
    <Grid container spacing={4}>
      <Grid item xs={6} style={{ overflowY: 'scroll', maxHeight: '500px' }}>
        <EntityPrometheusAlertCard onRowClick={getAlertData} />
      </Grid>
      <Grid item xs={6}>
        <InfoCard title="Runbook">
          {runbook && (
            <Grid
              item
              xs={12}
              style={{ overflowY: 'scroll', maxHeight: '400px' }}
            >
              <MarkdownContent content={runbook} />
            </Grid>
          )}
          {!runbook && !loading && <p>Select alert to display runbook</p>}
          {loading && <Progress />}
        </InfoCard>
      </Grid>
    </Grid>
  );
};
