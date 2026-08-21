# Rollouts in the GitOps Console

The GitOps Console plugin provides comprehensive details of Argo Rollouts instances in the cluster. You can view and create Rollout resources directly from the OpenShift web console.

## List page

The Rollouts list page displays all Argo Rollout resources with the following features:

* **Table columns**: Standard columns for Rollout resources
* **Filtering**: Filter Rollouts by rollout status (Healthy, Paused, Progressing, Degraded)
* **Pagination**: Browse results in pages of 10, 20, 50, or 100 items (default 50). Search and filters change which rows are included. See [Filter, search, and paginate resources](filter-resources.md).
* **Create action**: Click **Create Rollout** to open the YAML editor with a default Rollout template

## Topology integration

The OpenShift Console Topology view shows the cluster’s Rollout instances. The Topology view provides:

* Rollout Details and Overview sidebar tabs with information on the resource
* Context actions for Rollout resources
* Visual decorator on Rollout nodes

## Details page

The Rollout details page provides the following tabs:

* **Details tab**: Displays replicas with inline scale controls when you have the required permissions, rollout status, conditions, strategy-specific sections for Canary or Blue-Green services, a link to open this workload in the Topology view, and related navigation helpers.
* **YAML tab**: Provides a live manifest editor for the Rollout resource.
* **Revisions tab**: Displays ReplicaSet and revision-oriented information for the rollout, including:
  * Rollout status and strategy
  * Revision history with ReplicaSet details
  * Pod status and health
  
  This view provides the same information as the `oc argo rollouts get rollout` CLI command, including the functionality of the `--watch` option, allowing you to monitor rollout progress directly from the console. **Rollback** is available on a non-current revision when you have patch permission.
* **Pods tab**: Shows pods for the rollout with pod-level actions. The pods table supports filtering, sorting, and pagination. See [Filter, search, and paginate resources](filter-resources.md).
* **Events tab**: Shows Kubernetes events for the Rollout object.
