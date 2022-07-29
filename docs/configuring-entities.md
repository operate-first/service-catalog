# Configuring catalog entities

Catalog entities are configurable through YAML definition files which can be found [here][1]. Documentation on configuring entities without using any plugins can be found in the [upstream documentation][2]. The sections below describe how to configure installed plugins for catalog entities.

When creating new entities this [ADR][16] should be followed.

## TechDocs plugin

TechDocs plugin handles the building and the publishing of your documentation. For this plugin an annotation is not enough to configure it. Firstly [create the necessary file structure](#mkdocs) for your documentation. A [GitHub workflow][10] is required to on the repository that hosts the documentation source files. For a guide on how to [setup this workflow](#using-techdocs-workflow-template) check the subsection below. After the workflow is setup an url reference to your documentation is required in the catalog entity definition file. This url will not be used a reference for the documentation builder but as a reference to the source files in the catalog so that users can find the source files. See the example for an annotation below.

```yaml
annotations:
    backstage.io/techdocs-ref: url:https://github.com/operate-first/service-catalog/tree/main/docs
```

### MkDocs

TechDocs plugin uses [MkDocs][12] as the builder. Your directory structure should look like the one bellow. For more information on how to setup MkDocs, follow [this guide][14].

```
docs/
├── index.md
mkdocs.yaml
```

This default setup above is the most common use case when you have one documentation per one entity repository. However it is also posible to have multiple documentations for multiple entities in one repository. Each documented entity has to be contained in one directory. See the example below:

```
service1/
├── docs/
│   └── index.md
├── mkdocs.yaml
docs/
├── index.md
mkdocs.yaml
```

Depending on which setup you will chose the configuration of the workflow will be different.

### Using TechDocs workflow template

A template can be found [here][9], after the template has been coppiced uncomment this part:

```yaml
on:
  push:
    branches:
      - main
      - master
    paths:
      - "**/docs/**"
      - "mkdocs.yaml"
      - "mkdocs.yml"
```

since it will allow the workflow to run on any changes made to the documentation.

Next up define the steps for the workflow. Each step has to reference [this][11] action which is used to activate the build and publish process. A code snipped below explains how to use this action when your documentation is placed in the root of your directory:

```yaml
- name: Send dispatch for service-catalog
  uses: operate-first/service-catalog/.github/actions/docs-dispatch@main
  with:
    # Root of the repository
    docs_path: '.'
    # Name of your entity in the catalog
    entity_name: 'service-catalog'
    # Type of your entity in the catalog
    entity_kind: 'Component'
    # This can always be ${{ github.repository }}
    repository: ${{ github.repository }}
    # GitHub token that requires metadata:read and contents:read&write permissions to service-catalog repository
    token: ${{ secrets.SESHETA_TOKEN }}
```

If the documentation is not located in the root of the repository, a filter definition is required using [glob expresions][15]:

```yaml
- name: Send dispatch for service2
  uses: operate-first/service-catalog/.github/actions/docs-dispatch@main
  with:
    # Glob expression, filtering where your documentation root is
    filter: 'service2/**'
    # Directory path to your documentation folder relative to the repository root
    docs_path: 'service2'
    entity_name: 'service2'
    entity_kind: 'Component'
    repository: ${{ github.repository }}
    token: ${{ secrets.SESHETA_TOKEN }}
```

<!--Mermaid diagram showing techdocs architecture somewhere here -->
[Documentation reference][13]

## GitHub Insights/Security Insights

For the insights plugins to work it is required to put `github.com/project-slug` annotation to your components definition. The value of this annotation is a GitHub project slug which consists of the organization/user and the repository name, see the example below.

```yaml
annotations:
    github.com/project-slug: operate-first/service-catalog
```

As long as the repository is public `GitHub Insights` will be shown, for one exception. If the repository is private and the GitHub account that is used for the login and has the permission for the repository, insights will be also shown. This applies to `Security Insights` too, if the GitHub account has the correct permissions to view the repository security insights, the plugin will show them.

[Documentation reference for GitHub Insights][3]

[Documentation reference for GitHub Security Insights][4]

## ADR plugin

ADR plugin requires an annotation to be present in your component definition. Right now the only value that is accepted by the annotation is a GitHub repository link to the folder which contains your ADRs, see the example below.

```yaml
annotations:
    backstage.io/adr-location: https://github.com/operate-first/blueprint/tree/main/adr
```

[Documentation reference][5]

## Grafana plugin

The grafana plugin can display either links to dashboards or alerts on the overview page for a configured tag in the components annotations. For example:

```yaml
annotations:
    grafana/tag-selector: thoth
```

[Documentation reference][6]

## Kubernetes plugin

The kubernetes plugin requires a label attached to the metadata of a deployment and then it requires a special annotation in the component definition file, for example:

Deployment manifest:

```yaml
metadata:
  labels:
    backstage.io/kubernetes-id: service-catalog
```

Component definition:

```yaml
annotations:
  backstage.io/kubernetes-id: service-catalog
```

The plugin can also fetch Kubernetes resources using any Kubernetes labels:

Deployment manifest:

```yaml
metadata:
  labels:
    app: my-app
    component: front-end
```

Component definition:

```yaml
annotations:
  backstage.io/kubernetes-label-selector: 'app=my-app,component=front-end'
```

We prefer to use just kuberntes labels and the `kubernetes-label-selector`.

[Documentation reference][7]

## Badges plugin

This plugin provides a set of badges that can be used in your repository `README` or any other markdown files. They can be accessed via the dropdown menu when viewing an entity, see the picture below for guidance:

![Badges](img/badges.png)

[Documentation reference][8]


[1]: https://github.com/operate-first/apps/tree/master/service-catalog
[2]: https://backstage.io/docs/features/software-catalog/descriptor-format
[3]: https://roadie.io/backstage/plugins/github-insights
[4]: https://roadie.io/backstage/plugins/security-insights
[5]: https://github.com/backstage/backstage/tree/master/plugins/adr
[6]: https://github.com/K-Phoen/backstage-plugin-grafana
[7]: https://backstage.io/docs/features/kubernetes/overview
[8]: https://github.com/backstage/backstage/blob/master/plugins/badges/README.md
[9]: https://github.com/operate-first/service-catalog/blob/main/.github/workflows/techdocs-template.yaml
[10]: https://docs.github.com/en/actions/using-workflows
[11]: https://github.com/operate-first/service-catalog/blob/main/.github/actions/docs-dispatch/action.yaml
[12]: https://www.mkdocs.org
[13]: https://backstage.io/docs/features/techdocs/techdocs-overview
[14]: https://www.mkdocs.org/getting-started
[15]: https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#filter-pattern-cheat-sheet
[16]: https://github.com/operate-first/blueprint/blob/main/adr/0022-rules-for-entity-mapping-in-service-catalog.md
