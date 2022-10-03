import React, { useMemo, useState } from 'react';
import { EntityBadgesDialog } from '@backstage/plugin-badges';
import { EntityLayout, EntityLayoutProps } from '@backstage/plugin-catalog';
import BadgeIcon from '@material-ui/icons/CallToAction';

const LayoutWrapper = ({ children }: EntityLayoutProps) => {
  const [badgesDialogOpen, setBadgesDialogOpen] = useState(false);

  const extraMenuItems = useMemo(() => {
    return [
      {
        title: 'Badges',
        Icon: BadgeIcon,
        onClick: () => setBadgesDialogOpen(true),
      },
    ];
  }, []);

  return (
    <>
      <EntityLayout UNSTABLE_extraContextMenuItems={extraMenuItems}>
        {children}
      </EntityLayout>
      <EntityBadgesDialog
        open={badgesDialogOpen}
        onClose={() => setBadgesDialogOpen(false)}
      />
    </>
  );
};

export default LayoutWrapper;
