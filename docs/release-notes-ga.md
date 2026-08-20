# 1.22 GA release notes (draft)

Use this text in the OpenShift GitOps 1.22 release notes and compatibility matrix. Do not include a Technology Preview statement for the Console plugin.

GitOps Console plugin (General Availability)::
With this update, the GitOps Console plugin is generally available. After you install the Red Hat OpenShift GitOps Operator, you can manage Argo CD and Argo Rollouts resources from the OpenShift web console. This feature requires OpenShift Container Platform 4.19 or later. The plugin is enabled by default.
+
This feature includes:
+
* List and details pages for Applications, ApplicationSets, AppProjects, ImageUpdaters, and Rollouts
* Filters for health, sync, and resource-specific status
* Client-side pagination for list pages and details tables (10, 20, 50, or 100 items per page; default 50) after filters and search, with page state in the URL
* Graphical views for Applications and ApplicationSets
* Rollout topology in the OpenShift Console Topology view, including revision rollback
* YAML templates for creating resources
* Links between the OpenShift Console and the Argo CD UI
+
Known limitations: The Application kebab does not include Sync or Rollback actions. ApplicationSet creation uses YAML, not a form. The Application resource graph shows immediate managed resources, not the full Argo CD tree. Pagination is client-side on the loaded result set and does not use Kubernetes API `limit` or `continue` tokens.

Support matrix: Technology Preview in 1.21.0. General Availability in 1.22.0.
