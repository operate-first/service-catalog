/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react';
import { Grid } from '@material-ui/core';
import {
  EntityAboutCard,
  EntityLayout,
  EntitySwitch,
  isKind,
} from '@backstage/plugin-catalog';
import user from './user';
import group from './group';
import domain from './domain';
import resource from './resource';
import api from './api';
import component from './component';
import system from './system';

import Warning from './shared/Warning';
import LayoutWrapper from './shared/LayoutWrapper';

export const entityPage = (
  <EntitySwitch>
    <EntitySwitch.Case if={isKind('api')} children={api} />
    <EntitySwitch.Case if={isKind('component')} children={component} />
    <EntitySwitch.Case if={isKind('domain')} children={domain} />
    <EntitySwitch.Case if={isKind('group')} children={group} />
    <EntitySwitch.Case if={isKind('system')} children={system} />
    <EntitySwitch.Case if={isKind('resource')} children={resource} />
    <EntitySwitch.Case if={isKind('user')} children={user} />

    <EntitySwitch.Case>
      <LayoutWrapper>
        <EntityLayout.Route path="/" title="Overview">
          <Grid
            container
            spacing={3}
            alignItems="stretch"
            justifyContent="center"
          >
            <Warning />
            <Grid item xs={12} md={3}>
              <EntityAboutCard variant="gridItem" />
            </Grid>
          </Grid>
        </EntityLayout.Route>
      </LayoutWrapper>
    </EntitySwitch.Case>
  </EntitySwitch>
);

export default entityPage;
