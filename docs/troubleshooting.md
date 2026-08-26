# Troubleshooting

## Prerequisites

* You have access to the OpenShift web console.
* You have access to an OpenShift Container Platform 4.19 or later cluster.
* The GitOps Console plugin is enabled. See [Enable the GitOps Console plugin](admin-enable-plugin.md).

## Common issues

**GitOps is missing from the navigation**

The plugin is disabled, the cluster is older than OpenShift 4.19, or the plugin pods are not running. See [Enable the GitOps Console plugin](admin-enable-plugin.md). Refresh the browser after you enable the plugin.

**ImageUpdaters or Rollouts are missing**

Those list pages appear only when the matching CRDs are installed. Rollouts in the Developer **Topology** view also require OpenShift 4.19 or later. See [Rollouts in Developer Topology](topology.md#rollouts-in-developer-topology).

**Empty lists or disabled actions**

Confirm the **Project** (namespace) selector and that resources exist. Empty lists or disabled edit and delete actions often mean the user lacks OpenShift RBAC (`get`, `list`, `create`, `update`, `patch`, or `delete`) on the GitOps custom resources. An AppProject can still block an Argo CD sync after a YAML save succeeds. See [AppProjects in the GitOps Console](appprojects-rbac.md).

**Health is Unknown or missing**

The plugin reads health from the Application CR. Set `controller.resource.health.persist: "true"` in the `argocd-cmd-params-cm` ConfigMap (for example in the `openshift-gitops` namespace). See [Applications in the GitOps Console](applications.md).

**Application stays OutOfSync**

Check **Sync Status**, **History**, conditions, and **Events**. The Application kebab and History tab do not provide **Sync** or **Rollback**. Use the Argo CD UI, YAML, or the `argocd` CLI.

**View in Argo CD is missing or disabled**

The action requires a Route to the Argo CD server for that Application’s instance. Confirm the Argo CD Route exists in the Application namespace (or the instance namespace your Operator uses).

**The Application graph looks incomplete**

The **Graph view** on the Application **Resources** tab shows immediate managed resources only, not the full Argo CD resource tree. Use the Argo CD link on the tab for the complete hierarchy. See [Application resource graph](topology.md#application-resource-graph).

**List pages are slow**

Search, filtering, and pagination run in the browser on the loaded list. They do not use Kubernetes API `limit` or `continue` tokens. Select a narrower namespace or tighten filters. See [Filter, search, and paginate resources](filter-resources.md).

**Pagination shows unexpected totals**

Totals reflect the filtered and searched result set, not the full cluster inventory. Clear filters or search, then confirm the namespace selector.

**ImageUpdater shows no recent updates**

Nothing was recorded in `status.recentUpdates` for the last reconciliation cycle. Check **Ready**, **Conditions** (when present), and the ImageUpdater YAML `status`. Some ImageUpdater builds do not write conditions even when updates exist.

**Rollout Rollback is disabled**

Rollback is disabled for the current revision (the first revision in the tree), when the ReplicaSet is missing, or when you cannot `patch` the Rollout. Use a non-current revision and confirm your permissions. See [Rollouts in the GitOps Console](rollouts.md).
