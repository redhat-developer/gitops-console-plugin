# Troubleshooting

## Prerequisites

* You have access to the OpenShift web console.
* The GitOps Console plugin is enabled.

## Common issues

**GitOps is missing from the navigation**

The plugin is disabled, the cluster is older than OpenShift 4.19, or the plugin pods are not running. See [Enable the GitOps Console plugin](admin-enable-plugin.md). Refresh the browser after you enable the plugin.

**ImageUpdaters or Rollouts is missing**

Those pages are shown only when the matching CRDs are installed.

**Empty lists or disabled actions**

The user lacks OpenShift RBAC on the GitOps custom resources. An AppProject can still block a sync after YAML saves. See [AppProjects](appprojects-rbac.md).

**Health is Unknown or missing**

The plugin reads health from the Application CR. Set `controller.resource.health.persist: "true"` in `argocd-cmd-params-cm`.

**Application stays OutOfSync**

Check **Sync Status**, **History**, conditions, and **Events**. There is no Application **Sync** button. Use the Argo CD UI, YAML, or the `argocd` CLI.

**The Application graph looks incomplete**

The graph shows immediate children only. Open Argo CD for the full tree. See [Topology](topology.md).

**List pages are slow**

Search, filtering, and pagination run in the browser on the loaded list. Select a narrower namespace or tighten filters. See [Filter, search, and paginate resources](filter-resources.md).

**Pagination shows unexpected totals**

Totals reflect the filtered list, not the full cluster inventory. Clear filters or search, then confirm the namespace selector.

**ImageUpdater shows no recent updates**

Nothing was recorded in the last cycle. Check **Ready** and conditions.

**Rollout Rollback is disabled**

You selected the current revision, or you cannot `patch` the Rollout.
