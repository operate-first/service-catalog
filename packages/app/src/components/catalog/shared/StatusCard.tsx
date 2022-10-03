import React from 'react';

import { BottomLinkProps, ErrorBoundaryProps, InfoCard, InfoCardVariants } from '@backstage/core-components';
import { makeStyles } from '@material-ui/core/styles';
import { CardHeaderProps } from '@material-ui/core';

type StatusCardProps = {
  title?: React.ReactNode;
  subheader?: React.ReactNode;
  divider?: boolean;
  deepLink?: BottomLinkProps;
  errorBoundaryProps?: ErrorBoundaryProps;
  variant?: InfoCardVariants;
  children?: React.ReactNode;
  headerStyle?: object;
  headerProps?: CardHeaderProps;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  actionsClassName?: string;
  actions?: React.ReactNode;
  cardClassName?: string;
  actionsTopRight?: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  titleTypographyProps?: object;
};

const useStyles = makeStyles(
  {
    root: {
      height: '100%',
      minWidth: 250,
      margin: 12,
    },
    content: {
      height: 154,
      paddingTop: 20,
      textAlign: 'center',
    },
  },
  { name: 'StatusCard' },
);

const StatusCard = ({ children, ...props }: StatusCardProps ) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <InfoCard noPadding {...props}>
        <div className={classes.content}>{children}</div>
      </InfoCard>
    </div>
  );
};

export default StatusCard;
