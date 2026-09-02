# AppProjects in the GitOps Console

The GitOps Console plugin provides list and details pages for Argo CD AppProjects in the OpenShift web console. You can search and filter AppProjects, create them from a YAML template, review destinations and allow or deny rules, and manage roles and sync windows.

## Prerequisites

* You have access to the OpenShift web console.
* The GitOps Console plugin is enabled. See [Enable the GitOps Console plugin](admin-enable-plugin.md).
* You can list AppProjects in the selected namespace (or across namespaces, depending on your permissions).

## List page

1. In the **Administrator** or **Core platform** perspective, navigate to **GitOps** → **AppProjects**.

2. Optional: Use the **Project** dropdown to limit the list to one project (namespace), or choose all projects.

The AppProjects list page includes:

* **Filtering**: Filter AppProjects by:
  * **Description**: Has Description, No Description
  * **Applications**: Has Applications, No Applications
  * **Project Type**: Default Project, Custom Projects
  * **Source Repositories**: Has Source Repos, No Source Repos
  * **Destinations**: Has Destinations, No Destinations
* **Search**: Use the search field to match by **Name** or **Label**. Choose the mode from the dropdown next to the field.
* **Create action**: Click **Create AppProject** to open the YAML editor with a default AppProject template
* **Table columns**: **Name**, **Namespace**, **Description**, **Applications**, **Labels**, **Last Updated**, and row actions
* **Pagination**: Browse results in pages of 10, 20, 50, or 100 items (default 50). Search and filters change which rows are included. See [Filter, search, and paginate resources](filter-resources.md).

> **NOTE**
>
> Creation uses the YAML editor. The console does not provide an AppProject form wizard.

### Row actions

From the row kebab, you can:

* **Edit labels**
* **Edit annotations**
* **Edit AppProject** (opens the YAML editor)
* **Delete**

## AppProject details page

1. From the AppProjects list, click an AppProject name.

2. The details page breadcrumb shows **AppProjects** → **AppProject details**.

3. Use the page header **Actions** menu for the same edit and delete actions as the list.

The details page includes the following tabs.

### Details tab

The **Details** tab summarizes identity and project configuration counts.

Section title: **AppProject details**.

**Summary (left)**

* **Name**
* **Namespace**
* **Labels**, with **Edit**
* **Annotations**
* **Created at**

**Status and configuration (right)**

* **Project Type**: **Default Project** badge when the AppProject name is `default`
* **Description**: Project description when set
* **Applications**: Count of Applications that use this AppProject, with a link to the **Applications** tab
* **Destinations**: Count of allowed destinations, with a link to the **Allow/Deny** tab
* **Source Repositories**: Count of allowed source repositories
* **Source Namespaces**: Count of allowed source namespaces
* **Roles**: Count of Argo CD project roles, with a link to the **Roles** tab
* **Sync Windows**: Count of sync windows, with a link to the **Sync Windows** tab
* **Project-Scoped Clusters Only**: **Enabled** or **Disabled** when the field is set on the AppProject

### YAML tab

The **YAML** tab provides a live editor for the AppProject manifest. Use it to inspect or update the full resource definition.

The editor includes a **Schema** side panel that describes AppProject fields, and a **Download** control to save the YAML.

### Allow/Deny tab

The **Allow/Deny** tab shows which sources and destinations this AppProject permits, and which Kubernetes resource kinds are allowed or denied.

* **Allowed Sources**: **Repositories** and **Namespaces** that applications in this project may use as sources. An **Argo CD** link under this section opens the project summary in the Argo CD UI when a Route to the Argo CD server is available.
* **Allowed Destinations**: A table of allowed or denied destinations with **Type**, **Server**, **Name**, and **Namespace**
* **Resource Allow/Deny Lists**: Four lists of Kubernetes kinds — **Cluster Resource Allow List**, **Cluster Resource Deny List**, **Namespace Resource Allow List**, and **Namespace Resource Deny List**. Each list shows **Kind** and **Group**.

Source repositories, source namespaces, and destinations use **Allow** or **Deny** badges. Empty lists show a placeholder.

### Applications tab

The **Applications** tab shows Applications that belong to this AppProject.

The table provides the same experience as the main Applications list, including search, filtering, and pagination, scoped to this project. See [Applications in the GitOps Console](applications.md) and [Filter, search, and paginate resources](filter-resources.md).

### Roles tab

The **Roles** tab displays Argo CD project roles and bindings in a paginated table. An **Argo CD** link on the tab opens the project roles page in the Argo CD UI when a Route to the Argo CD server is available.

| Column | Description |
| --- | --- |
| **Name** | Role name. |
| **Description** | Role description. |
| **Groups** | Groups bound to the role. |
| **Policies** | Policy statements for the role. |

These are Argo CD AppProject roles, not OpenShift RoleBindings.

### Sync Windows tab

The **Sync Windows** tab shows configured sync windows for the project in a paginated table. An **Argo CD** link on the tab opens the project sync windows page in the Argo CD UI when a Route to the Argo CD server is available.

| Column | Description |
| --- | --- |
| **Kind** | Window kind, such as allow or deny. |
| **Schedule** | Cron schedule for the window. |
| **Duration** | How long the window lasts. |
| **Applications** | Applications covered by the window. |
| **Clusters** | Clusters covered by the window. |
| **Namespaces** | Namespaces covered by the window. |
| **Manual Sync** | Whether manual sync is allowed during the window. |
| **Time Zone** | Time zone for the schedule. |

### Events tab

The **Events** tab shows Kubernetes events for the AppProject object, using the standard console event stream for that resource.

## Mapping OpenShift RBAC to AppProject permissions

OpenShift RBAC and Argo CD AppProject rules both apply; they control different things.

* **OpenShift RBAC** controls whether you can get, list, create, update, patch, or delete AppProject (and other GitOps) custom resources. The plugin uses Console access reviews:
  * **patch** — edit labels and annotations
  * **update** — edit AppProject and save YAML
  * **delete** — delete the AppProject
  * **get** / **list** — open list and details pages
* **AppProject rules** control what Argo CD may sync for Applications in that project (source repositories, destinations, and allow or deny resource lists). A YAML save can succeed while a sync still fails if those rules block the resources.
* The **Roles** tab shows Argo CD AppProject roles and group bindings, not OpenShift RoleBindings. The plugin does not create OpenShift Roles from AppProject roles. Use OpenShift RoleBindings for console and API access to the CRs.

## Related information

* [Filter, search, and paginate resources](filter-resources.md)
* [Applications in the GitOps Console](applications.md)
* [Troubleshooting](troubleshooting.md)
