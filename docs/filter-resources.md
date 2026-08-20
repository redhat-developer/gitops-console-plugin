# Filter resources

The GitOps Console plugin provides filters to narrow the resource list based on specific properties. The available filter options vary by resource type.

## Prerequisites

* You have access to the OpenShift web console.
* The GitOps Console plugin is enabled.

## Procedure

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

## Verification

* Verify that the resource list displays only items matching your selected filter criteria.
