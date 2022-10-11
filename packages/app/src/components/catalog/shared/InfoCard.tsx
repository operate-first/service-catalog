import React from 'react';
import { InfoCard as Card, Link, Table } from '@backstage/core-components';
import {
  RELATION_OWNED_BY,
  RELATION_PART_OF,
} from '@backstage/catalog-model';
import {
  EntityRefLinks,
  getEntityRelations,
  useEntity,
} from '@backstage/plugin-catalog-react';
import {
  Avatar,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  makeStyles,
} from '@material-ui/core';
import { ICON_ANNOTATION } from '../../../constants'

const useStyles = makeStyles(() => ({
  avatar: {
    width: '100%',
    heigth: '100%'
  },
  table: {
    padding: 0
  },
  header: {
    paddingBottom: 10
  }
}));

export const InfoCard = () => {
  const classes = useStyles();

  const { entity } = useEntity();

  const ownedByRelations = getEntityRelations(entity, RELATION_OWNED_BY);
  const partOfSystemRelations = getEntityRelations(entity, RELATION_PART_OF, {
    kind: 'system',
  });
  const partOfComponentRelations = getEntityRelations(
    entity,
    RELATION_PART_OF,
    { kind: 'component' },
  );
  const partOfDomainRelations = getEntityRelations(entity, RELATION_PART_OF, {
    kind: 'domain',
  });

  const isSystem = entity.kind.toLocaleLowerCase('en-US') === 'system';
  const isResource = entity.kind.toLocaleLowerCase('en-US') === 'resource';
  const isComponent = entity.kind.toLocaleLowerCase('en-US') === 'component';
  const isAPI = entity.kind.toLocaleLowerCase('en-US') === 'api';
  const isTemplate = entity.kind.toLocaleLowerCase('en-US') === 'template';
  const isLocation = entity.kind.toLocaleLowerCase('en-US') === 'location';
  const isGroup = entity.kind.toLocaleLowerCase('en-US') === 'group';

  const logoUrl = entity.metadata.annotations?.[ICON_ANNOTATION]
  const data = [
    {
      name: 'Team',
      value:
        ownedByRelations.length > 0 ? (
          <EntityRefLinks entityRefs={ownedByRelations} defaultKind="group" />
        ) : (
          'No owner'
        ),
    },
    ...(isSystem || partOfDomainRelations.length > 0
      ? [
          {
            name: 'Domain',
            value:
              partOfDomainRelations.length > 0 ? (
                <EntityRefLinks
                  entityRefs={partOfDomainRelations}
                  defaultKind="domain"
                />
              ) : (
                'No domain'
              ),
          },
        ]
      : []),
    ...(isAPI || isComponent || isResource || partOfSystemRelations.length > 0
      ? [
          {
            name: 'System',
            value:
              partOfSystemRelations.length > 0 ? (
                <EntityRefLinks
                  entityRefs={partOfSystemRelations}
                  defaultKind="system"
                />
              ) : (
                'No system'
              ),
          },
        ]
      : []),
    ...(isComponent && partOfComponentRelations.length > 0
      ? [
          {
            name: 'Parent component',
            value:
              partOfComponentRelations.length > 0 ? (
                <EntityRefLinks
                  entityRefs={partOfComponentRelations}
                  defaultKind="component"
                />
              ) : (
                'No parent'
              ),
          },
        ]
      : []),
    ...(isAPI ||
    isComponent ||
    isResource ||
    isTemplate ||
    isGroup ||
    isLocation ||
    typeof entity?.spec?.type === 'string'
      ? [{ name: 'Type', value: entity?.spec?.type || 'No type' }]
      : []),
    ...(isAPI || isComponent || typeof entity?.spec?.lifecycle === 'string'
      ? [{ name: 'Lifecycle', value: entity?.spec?.lifecycle || 'None' }]
      : []),
    ...(Boolean(entity.metadata.annotations?.['github.com/project-slug'])
      ? [
          {
            name: 'Repository',
            value: (
              <Link
                to={`https://github.com/${entity.metadata.annotations?.['github.com/project-slug']}`}
              >
                {entity.metadata.annotations?.['github.com/project-slug']}
              </Link>
            ),
          },
        ]
      : []),
    {
      name: 'Tags',
      value: (entity?.metadata?.tags || []).map(t => (
        <Chip key={t} size="small" label={t} />
      )),
    },
  ];
  return (
    <Card noPadding>
      <CardHeader
        title="Information"
        subheader={entity.metadata.description}
        avatar={
          logoUrl &&
          <Avatar className={classes.avatar}
            variant="square"
            alt={`${entity.metadata.name} logo`}
            src={logoUrl}
          />
        }
        titleTypographyProps={{ variant: 'h5' }}
        className={classes.header}
      />
      <CardContent className={classes.table} >
        <Divider />
        <Table
          options={{
            search: false,
            paging: false,
            toolbar: false,
            header: false,
            padding: 'dense',
          }}
          data={data}
          columns={[
            { field: 'name', highlight: true, width: '30%', cellStyle: { whiteSpace: 'nowrap' } },
            { field: 'value' },
          ]}
        />
      </CardContent>
    </Card>
  );
};

export default InfoCard;
