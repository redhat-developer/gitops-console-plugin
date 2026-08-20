# Enable the GitOps Console plugin

The GitOps Console plugin is enabled by default after you install the Red Hat OpenShift GitOps Operator. If you disable the plugin, you can enable it manually.

## Prerequisites

* You have installed the Red Hat OpenShift GitOps Operator.
* You have access to the OpenShift web console with cluster administrator permissions.

## Procedure

1. In the OpenShift web console, navigate to **Home** → **Overview**.

2. In the **Status** panel, click **Dynamic Plugins**.
   
   A popup appears with a link to view all dynamic plugins.

3. Click **View all**.

4. Under the **Console plugins** tab, find **gitops-plugin**.

5. If the plugin is disabled, click **Enable**.
   
   The browser might require a refresh. After refreshing, the page indicates that the plugin is **Enabled**.

## Verification

* Navigate to **GitOps** in the navigation menu and verify that you can access Applications, ApplicationSets, AppProjects, ImageUpdaters, and Rollouts pages.

## Disable the plugin

Use the same **Console plugins** list and disable **gitops-plugin**.

CLI: add or remove `gitops-plugin` in the `spec.plugins` list of `console.operator.openshift.io/cluster`.

## Multi-instance configuration

The plugin is cluster-wide. It is not one plugin per Argo CD instance. Resources from all instances appear by using the namespace selector. **View in Argo CD** opens the Argo CD UI for that application when a Route exists.
