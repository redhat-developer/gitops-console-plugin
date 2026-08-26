# Working with the GitOps Console plugin

The GitOps Console plugin extends the OpenShift Container Platform web console by adding GitOps resources. The plugin is available as part of the Red Hat OpenShift GitOps Operator and provides a console UI for managing Argo CD and Argo Rollouts custom resources.

After you install the Red Hat OpenShift GitOps Operator, the OpenShift web console displays a **GitOps** navigation tab in the **Administrator** perspective. The plugin is enabled by default. The GitOps navigation tab replaces the previous **Environments** tab and related pages in the **Developer** perspective.

The GitOps navigation tab provides access to the following Argo CD and Argo Rollouts resources:

* Applications
* ApplicationSets
* AppProjects
* ImageUpdaters
* Rollouts

## Prerequisites

* You have access to OpenShift Container Platform 4.19 or later.
* You have installed the Red Hat OpenShift GitOps Operator.

## GitOps resources in the web console

Each GitOps resource provides list and details pages that follow the standard OpenShift web console experience.

You can use these pages to:

* View GitOps resources in a selected namespace
* Create resources by using YAML templates
* Edit labels and annotations
* Filter resources by status, where applicable
* Paginate large filtered lists and details tables (10, 20, 50, or 100 items per page; default 50)
* Access related resources and events

The GitOps Console plugin integrates with the console navigation, allowing you to navigate between related resources and access contextual actions for each resource type.

### Search and YAML templates

The GitOps Console plugin provides search and template capabilities:

* **Search integration**: Search pages are enabled for Applications and ApplicationSets, allowing you to find instances from global search like other first-class resources.
* **YAML templates**: Pre-configured YAML templates are registered for Applications, ApplicationSets, AppProjects, ImageUpdaters, and Rollouts. These templates provide starter configurations with placeholders to speed up resource creation from the console.

## Additional resources

* [Enable the GitOps Console plugin](admin-enable-plugin.md)
* [Applications in the GitOps Console](applications.md)
* [ApplicationSets in the GitOps Console](applicationsets.md)
* [AppProjects in the GitOps Console](appprojects-rbac.md)
* [ImageUpdaters in the GitOps Console](image-updaters.md)
* [Rollouts in the GitOps Console](rollouts.md)
* [Filter, search, and paginate resources](filter-resources.md)
* [Graphs and topology views](topology.md)
* [Getting started](getting-started.md)
* [Troubleshooting](troubleshooting.md)

## Preview this manual

From the `gitops-console-plugin` repository root:

```bash
pnpm serve-docs
```

Open [http://localhost:3000](http://localhost:3000).
