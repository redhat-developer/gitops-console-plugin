# Getting started
Use the OpenShift web console to install GitOps, enable the Console plugin, and open the GitOps pages.

<video src="assets/videos/getting-started-demo.mp4" autoplay muted loop playsinline controls width="100%"></video>


## Prerequisites

* You have access to an OpenShift Container Platform 4.19 or later cluster.
* You can log in to the web console with cluster-admin permission to install the Operator and enable the plugin.

## Install the OpenShift GitOps Operator

1. In the web console, navigate to **Ecosystem** → **Software Catalog**.

2. In the **Filter by keyword** box, type **Red Hat OpenShift GitOps**.

3. Click the **Red Hat OpenShift GitOps** tile, then click **Install**.

4. Keep the default options unless your cluster requires otherwise, then click **Install**.

5. Wait until **Ecosystem** → **Installed Operators** shows the Operator as **Succeeded**.

The software catalog installs the Operator and deploys the Console plugin. You do not download a separate plugin binary.

## Enable the GitOps Console plugin

If **GitOps** is already in the navigation, skip this step. Otherwise follow [Enable the GitOps Console plugin](admin-enable-plugin.md).

## Open the GitOps pages

1. In the **Administrator** perspective, click **GitOps**.

2. Verify that you can open the following pages:

   * **Applications**
   * **ApplicationSets**
   * **AppProjects**
   * **ImageUpdaters**
   * **Rollouts**

ImageUpdaters and Rollouts appear when those CRDs are installed on the cluster.

## Verification

* After a browser refresh, **GitOps** remains in the navigation.
* You can open each list page and change the namespace.

## Additional resources

* [Enable the GitOps Console plugin](admin-enable-plugin.md)
* [Applications in the GitOps Console](applications.md)
* [Filter, search, and paginate resources](filter-resources.md)
* [Troubleshooting](troubleshooting.md)
