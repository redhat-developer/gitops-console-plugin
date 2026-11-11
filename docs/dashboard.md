# GitOps Overview dashboard

The GitOps Console plugin provides an **Overview** page under **GitOps**. Use it to see Application sync and health at a glance, review Applications that need attention, check recent sync operations, and inspect GitOps infrastructure in the selected project or across all projects.

The page title is **GitOps Overview**. It has two tabs:

* **Application Overview**
* **Infrastructure**

## Prerequisites

* You have access to the OpenShift web console.
* The GitOps Console plugin is enabled. See [Enable the GitOps Console plugin](admin-enable-plugin.md).
* You can list Applications (and other GitOps resources on the **Infrastructure** tab) in the selected namespace, or across namespaces, depending on your permissions.
* The **Operational metrics**, **Application Sync Activity (24 hours)**, and **Application Reconciliation Performance (24 hours)** cards require cluster monitoring and Argo CD Prometheus metrics. Sync status, Health status, Applications Needing Attention, and Recent Operations use Application data from the Kubernetes API and do not require Prometheus. If Prometheus metrics are missing, the three metric cards show an error or empty state.

## Open the Overview

1. In the **Administrator** or **Core platform** perspective, navigate to **GitOps** → **Overview**.

2. Optional: Use the project (namespace) bar to limit the dashboard to one project, or choose all projects.

Changing the project updates both tabs. Counts, charts, and lists reflect Applications and other resources in that scope.

## Application Overview tab

The **Application Overview** tab summarizes Application status for the selected project (or all projects).

### Sync status

The **Sync status** card shows a donut chart of Applications by sync state:

* **Synced**
* **OutOfSync**
* **Unknown**

Legend entries include counts and percentages. Click a sync status link to open the Applications list filtered to that status. See [Applications in the GitOps Console](applications.md) and [Filter, search, and paginate resources](filter-resources.md).

### Health status

The **Health status** card shows a donut chart of Applications by health:

* **Healthy**
* **Progressing**
* **Degraded**
* **Missing**
* **Suspended**
* **Unknown**

Legend entries include counts and percentages. Click a health status link to open the Applications list filtered to that health. If health is missing or incorrect on Applications, see [Troubleshooting](troubleshooting.md).

### Operational metrics

The **Operational metrics** card shows live Argo CD metrics for the selected scope. Metric labels link to the console metrics query browser. Values refresh about every 10 seconds when metrics are available, and the card title shows the time of the last update.

The card shows:

* **Successful syncs** — cumulative count of syncs with phase Succeeded (not limited to the last 24 hours)
* **Failed syncs** — count of syncs that are not Succeeded in a 24-hour sliding window
* **Orphaned resources**
* **Apps with Autosync enabled**
* **Apps with Autosync disabled**
* **Repo Queue**
* **Git fetch failures**

Click a metric to open the related query in monitoring.

> **NOTE**
>
> If a query fails, that metric shows a red dash (`-`). If the query succeeds but returns no data, the metric shows `0`, which looks the same as a real zero. When a value looks wrong, open the query in monitoring to confirm whether the metric is being collected.

### Applications Needing Attention

The **Applications Needing Attention** card lists Applications that are not both **Healthy** and **Synced** (subtitle: **Not Healthy or not Synced**). The title includes the count of matching Applications.

Each row can show:

* **Application**
* **Details** (for example conditions or resource status)
* **Status** (health and sync)

Use the Application name link to open the Application details page. Use **View Applications List Page** when present to open the Applications list for the current scope.

The card lists up to 20 Applications. When more than 20 need attention, the card ends with **...and *n* more**, and the count in the title remains the full number.

When every Application is Healthy and Synced, the card shows an empty state.

### Recent Operations

The **Recent Operations** card lists up to the last **5** Application operations that have a finished operation state, newest first (subtitle: **Last 5 operations**).

Each row can show:

* **Application**
* **Phase** (for example Succeeded, Failed, Running)
* **Message**
* **Finished At**

Use the Application name link to open details. When no finished operations are present, the card shows an empty state.

### Application Sync Activity (24 hours)

The **Application Sync Activity (24 hours)** card charts three Prometheus series over the last 24 hours for the selected project or all projects:

| Series | Description |
| --- | --- |
| **Syncs (24h sliding window)** | Number of sync operations in a 24-hour moving window. A sync adds one to this count and drops off 24 hours later. |
| **Synced** | Number of Applications in the **Synced** state. |
| **Out of Sync** | Number of Applications in the **OutOfSync** state. |

If metrics are missing, the card shows loading, empty, or error content. Use **View in Observe/Metrics** when metrics load without error to open the related monitoring query.

### Application Reconciliation Performance (24 hours)

The **Application Reconciliation Performance (24 hours)** card charts Application reconciliations from the `argocd_app_reconcile_count` metric for the selected project or all projects:

| Series | Description |
| --- | --- |
| **Reconciliations (24h sliding window)** | Number of Application reconciliations in a 24-hour moving window. |

Use it to see how often Applications are reconciled in the selected scope.

If metrics are missing, the card shows loading, empty, or error content. Use **View in Observe/Metrics** when metrics load without error to open the related monitoring query.

## Infrastructure tab

The **Infrastructure** tab shows cards for GitOps-related operators and custom resources in the selected project or across all projects. Most resource cards show a **Total** count in the card title, an entry for each resource, and links to view the list or create a resource. The **GitOps Operator** card does not show a **Total** count; it shows Operator CSV details when found.

The tab contains these cards, in order:

* **GitOps Operator**
* **Argo CD Instances**
* **App Projects**
* **Applications**
* **ApplicationSets**
* **Image Updaters**
* **Rollout Managers**
* **Rollouts**

All cards are always displayed. A card for a resource whose CRD is not installed on the cluster shows an error instead of a count, rather than being hidden.

### GitOps Operator card

When the Red Hat OpenShift GitOps Operator ClusterServiceVersion (CSV) is found in the selected scope, this card shows the CSV name as a link to its details page, the install phase (for example **Succeeded**, **Pending**, or **Failed**) with a status icon, and these fields:

* **Version**
* **Display Name**
* **Provider**
* **Namespace** — the project currently selected in the project bar, or **All Namespaces**, not the namespace the Operator is installed in
* **Message** — the status message from the CSV
* **Created At**

### Resource card links

* For **Applications**, **ApplicationSets**, **App Projects**, **Image Updaters**, **Rollout Managers**, and **Rollouts**, **View list** opens the corresponding GitOps list page for the current scope when you have permission to list that resource. **Create** appears only when you have selected a specific project and you have permission to create that resource. In **All Projects**, no create link is shown.
* **Argo CD Instances** does not provide a view-list link. A create action can appear when the Operator is installed, no instances are listed, and a single project is selected.
* **GitOps Operator** links to the ClusterServiceVersion details when the Operator is found; it does not offer create.

## Related information

* [Getting started](getting-started.md)
* [Applications in the GitOps Console](applications.md)
* [ApplicationSets in the GitOps Console](applicationsets.md)
* [AppProjects in the GitOps Console](appprojects-rbac.md)
* [ImageUpdaters in the GitOps Console](image-updaters.md)
* [Rollouts in the GitOps Console](rollouts.md)
* [Filter, search, and paginate resources](filter-resources.md)
* [Troubleshooting](troubleshooting.md)
