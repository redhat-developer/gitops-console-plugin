# Applications in the GitOps Console

The GitOps Console plugin shows key details of an Argo CD Application. You can view and create Applications directly from the OpenShift Container Platform web console. A **Graphical view** in the **Resources** tab of the Details page shows the application’s resources in a tree structure.

> **IMPORTANT**
>
> The GitOps Console plugin displays the health status stored in the Application custom resource (CR). By default, this behavior depends on the configuration set by the Operator. If the Application CR does not contain the health status or the GitOps Console plugin does not display it correctly, set `controller.resource.health.persist: "true"` in the `argocd-cmd-params-cm` config map.

## List page

The Applications list page displays all Applications with the following features:

* **Table columns**: name, namespace, sync status, health, revision, AppProject, and actions
* **Filtering**: Filter Applications by health status (Healthy, Progressing, Degraded, Missing) and sync status (Synced, OutOfSync, Unknown)
* **Sorting and search**: Sort columns and search by name
* **Pagination**: After filters and search, browse results in pages of 10, 20, 50, or 100 items (default 50). Page and page size are stored in the URL. See [Filter and paginate resources](filter-resources.md).
* **Create action**: Click **Create Application** to open the YAML editor with a starter template that includes repository URL, destination, and sync policy placeholders
* **Namespace view**: From the GitOps Operator namespace path, an optional control can list operands in all namespaces for operator-focused workflows

## Details page

The Application details page provides the following tabs:

* **Details tab**: Displays summary information, health and sync indicators, revision links, destination and project information, conditions, toggles for automated sync, self-heal, and prune (when you have update permission), and detection of an Argo CD Route so you can open the Argo CD UI for the same application when routing is configured.
* **YAML tab**: Provides a live manifest editor for the Application resource.
* **Sources tab**: Displays repository sources with icons and metadata for Helm, Git, and OCI sources. The sources table supports pagination.
* **Resources tab**: Combines a resource table with an interactive topology graph:
  * The graph shows immediate managed resources for the Application, not the full Argo CD resource tree.
  * Use the Argo CD link on the tab to open the complete resource hierarchy in the Argo CD UI.
  * Pan, zoom, and select resources in the graph; status filters apply to both table and graph.
  * In list view, the resources table supports filtering, sorting, and pagination like other GitOps tables. See [Filter and paginate resources](filter-resources.md).
  * Context-menu actions on graph nodes include viewing details, editing labels and annotations, deleting resources, and viewing resources in Argo CD.
  * Related resources of the same kind can be grouped or ungrouped in the graph.
* **Sync Status tab**: Provides fine-grained sync and operation status information for the Application, including a paginated table of resources last synced.
* **History tab**: Displays the deployment and sync history for the Application in a paginated table (newest first by default; column sort keeps the selected direction).
* **Events tab**: Shows Kubernetes events for the Application object.

## Additional features

* **Favorites**: You can mark Applications as favorites based on console user settings.
* **Standard actions**: The page header provides access to standard actions such as editing labels, annotations, and deleting the Application.

## View, sync, and rollback

* **View**: Use the list page and the details tabs.
* **Sync**: The Application kebab does not include a **Sync** action. Use the automated, self-heal, and prune toggles on the **Details** tab, the Argo CD UI, the `argocd` CLI, or YAML.
* **Rollback**: The Application kebab does not include a **Rollback** action. Use the **History** tab as a reference, then the Argo CD UI or CLI. For Rollout rollback, see [Rollouts in the GitOps Console](rollouts.md).
