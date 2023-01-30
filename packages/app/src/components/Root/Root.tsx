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

import React, { PropsWithChildren } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import ExtensionIcon from '@material-ui/icons/Extension';
import CategoryIcon from '@material-ui/icons/Category';
import StorageIcon from '@material-ui/icons/Storage';
import LibraryBooks from '@material-ui/icons/LibraryBooks';
import GavelIcon from '@material-ui/icons/Gavel';
import Logo from '../Logo/Logo';
import {
  Settings as SidebarSettings,
  UserSettingsSignInAvatar,
} from '@backstage/plugin-user-settings';
import { SidebarSearchModal } from '@backstage/plugin-search';
import {
  Sidebar,
  sidebarConfig,
  SidebarDivider,
  SidebarGroup,
  SidebarItem,
  SidebarPage,
  SidebarSpace,
  useSidebarOpenState,
  Link,
} from '@backstage/core-components';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import {
  BrandGithub,
  BrandSlack,
  BrandTwitter,
  BrandYoutube,
} from 'tabler-icons-react';

const useSidebarLogoStyles = makeStyles({
  root: {
    width: sidebarConfig.drawerWidthClosed,
    height: 3 * sidebarConfig.logoHeight,
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    marginBottom: -14,
  },
  linkExpanded: {
    marginLeft: 24,
  },
  linkCollapsed: {
    width: sidebarConfig.drawerWidthClosed,
  },
});

const SidebarLogo = () => {
  const classes = useSidebarLogoStyles();
  const { isOpen } = useSidebarOpenState();

  return (
    <div className={classes.root}>
      <Link
        to="/"
        underline="none"
        className={isOpen ? classes.linkExpanded : classes.linkCollapsed}
        aria-label="Home"
      >
        {isOpen ? <Logo /> : <Logo classes={{ svg: classes.linkCollapsed }} />}
      </Link>
    </div>
  );
};

const links = [
  <a href="https://github.com/operate-first" target="_blank" rel="noreferrer">
    <BrandGithub color="white" />
  </a>,
  <a
    href="https://join.slack.com/t/operatefirst/shared_invite/zt-o2gn4wn8-O39g7sthTAuPCvaCNRnLww"
    target="_blank"
    rel="noreferrer"
  >
    <BrandSlack color="white" />
  </a>,
  <a
    href="https://www.youtube.com/channel/UCe87bwqlGoBQs2RvMQZ5_sg"
    target="_blank"
    rel="noreferrer"
  >
    <BrandYoutube color="white" />
  </a>,
  <a href="https://twitter.com/OperateFirst" target="_blank" rel="noreferrer">
    <BrandTwitter color="white" />
  </a>,
];

export const Root = ({ children }: PropsWithChildren<{}>) => (
  <SidebarPage>
    <Sidebar>
      <SidebarLogo />
      <SidebarGroup label="Search" icon={<SearchIcon />} to="/search">
        <SidebarSearchModal />
      </SidebarGroup>
      <SidebarDivider />
      <SidebarGroup label="Menu" icon={<MenuIcon />}>
        <SidebarItem icon={HomeIcon} to="/" text="Home" />
        <SidebarItem icon={CategoryIcon} to="catalog" text="Catalog" />
        <SidebarItem icon={StorageIcon} to="ocm" text="Clusters" />
        <SidebarDivider />
        <SidebarItem icon={GavelIcon} to="adrs" text="ADRs" />
        <SidebarItem icon={LibraryBooks} to="docs" text="Docs" />
        <SidebarItem icon={ExtensionIcon} to="api-docs" text="APIs" />
        {/* <SidebarItem icon={CreateComponentIcon} to="create" text="Create..." /> */}
        <SidebarSpace />
        <Grid container spacing={2} justifyContent="center">
          {links.map((l, idx) => (
            <Grid item key={idx}>
              {l}
            </Grid>
          ))}
        </Grid>
      </SidebarGroup>
      <SidebarDivider />
      <SidebarGroup
        label="Settings"
        icon={<UserSettingsSignInAvatar />}
        to="/settings"
      >
        <SidebarSettings />
      </SidebarGroup>
    </Sidebar>
    {children}
  </SidebarPage>
);
