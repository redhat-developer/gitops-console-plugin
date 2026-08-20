# AppProjects in the GitOps Console

The GitOps Console plugin provides summary details for Argo CD AppProjects. You can view and create project-scoped AppProjects directly from the OpenShift web console.

## List page

The AppProjects list page displays all project-scoped AppProjects with the following features:

* **Table columns**: Standard columns for custom resources
* **Filtering**: Filter projects by Description, Applications, Project Type, Source Repositories, and Destinations
* **Create action**: Click **Create AppProject** to open the YAML editor with a default AppProject template

## Details page

The AppProject details page provides the following tabs:

* **Details tab**: Displays project summary, destinations, policies, and related metadata.
* **YAML tab**: Provides a live manifest editor for the AppProject resource.
* **Allow/Deny tab**: Displays resource allow and deny lists for cluster-scoped and namespace-scoped kinds.
* **Applications tab**: Shows Applications that belong to this project. The table provides the same experience as the main Application list, filtered by project.
* **Roles tab**: Displays Argo CD project roles and bindings.
* **Sync Windows tab**: Shows configured sync windows for the project.
* **Events tab**: Shows Kubernetes events for the AppProject object.

## Mapping OpenShift RBAC to AppProject permissions

OpenShift role-based access control (RBAC) and Argo CD AppProject rules both apply.

OpenShift RBAC determines whether a user can get, list, create, update, patch, or delete GitOps custom resources in a namespace. The plugin uses Console access reviews. Without update permission, edit actions and sync-policy toggles are disabled. Without delete permission, delete is disabled.

AppProject determines which Git repositories, destinations, and resource kinds Argo CD synchronizes. The **Roles** tab shows Argo CD project roles, not OpenShift RoleBindings.

The plugin does not create OpenShift Roles from AppProject roles. Bind OpenShift users by using RoleBindings.

* Opening a page requires OpenShift `get` and `list` permissions.
* Saving YAML requires OpenShift `update` permission.
* A successful Argo CD sync requires AppProject destinations, source repositories, and allow or deny lists to permit the resources.
