# Filter and paginate resources

The GitOps Console plugin provides filters to narrow the resource list based on specific properties. Large filtered lists use client-side pagination that matches the OpenShift web console list experience. The available filter options vary by resource type.

## Prerequisites

* You have access to the OpenShift web console.
* The GitOps Console plugin is enabled.

## Filtering

1. In the OpenShift web console, navigate to **GitOps** and select a resource type.

2. On the list page, use the available filter controls to narrow the displayed resources.
   
   The following filters are available depending on the resource type:
   
   * **Applications**: Filter by health status (Healthy, Progressing, Degraded, Missing) and sync status (Synced, OutOfSync, Unknown).
   * **ApplicationSets**: Filter by health status (Healthy, Error, Unknown).
   * **AppProjects**: Filter by Description, Applications, Project Type, Source Repositories, and Destinations.
   * **ImageUpdaters**: Filter by applications (Has Apps, No Apps) and ready status (Ready, Not Ready).
   * **Rollouts**: Filter by rollout status (Healthy, Paused, Progressing, Degraded).

3. Optional: Combine multiple filters to narrow the results further.

4. To clear filters, click the **Clear all filters** link or remove individual filter selections.

## Pagination

List pages for Applications, ApplicationSets, AppProjects, ImageUpdaters, and Rollouts paginate rows after filters and search are applied.

Pagination also applies to nested and details tables that use the same shared table:

* The **Applications** tab on an ApplicationSet details page
* The **Applications** tab on an AppProject details page
* Application details: **Resources** (list view), **Sources**, **Sync Status** (resources last synced), and **History**
* AppProject details: **Roles** and **Sync Windows**
* ImageUpdater details: **Recent Updates**
* Rollout details: **Pods**

### Behavior

* **Page size**: Choose **10**, **20**, **50**, or **100** items per page. The default is **50**. There is no **All** option.
* **Controls**: Pagination appears above and below the table when the filtered list contains at least one row.
* **URL state**: The current page and page size are stored in the URL (`page` and `perPage`) so you can refresh or share the view.
* **Reset**: Changing filters, name or label search, or the selected namespace returns you to page 1. Changing the page size or sorting does not reset the page by itself; if the list shrinks, the page is clamped to the last valid page.
* **Client-side only**: Pagination runs in the browser on the already loaded and filtered list. It does not use Kubernetes API `limit` or `continue` tokens.

## Verification

* Verify that the resource list displays only items matching your selected filter criteria.
* Verify that the pagination controls show the correct total for the filtered list and that changing the page size updates the table.
