# ImageUpdaters in the GitOps Console

The GitOps Console plugin shows Argo CD Image Updater custom resources. You can view and create ImageUpdater resources from the OpenShift web console. The **ImageUpdaters** page is available when the ImageUpdater custom resource definition is installed on the cluster.

## List page

The ImageUpdaters list page displays ImageUpdater resources with the following features:

* **Table columns**: name, namespace, applications matched, images managed, last checked, ready, labels, and actions
* **Filtering**: Filter by applications (Has Apps, No Apps) and ready status (Ready, Not Ready)
* **Pagination**: Browse results in pages of 10, 20, 50, or 100 items (default 50). Search and filters change which rows are included. See [Filter, search, and paginate resources](filter-resources.md).
* **Create action**: Click **Create ImageUpdater** to open the YAML editor with a starter template

## Details page

The ImageUpdater details page provides the following tabs:

* **Details tab**: Displays ready status, applications matched, images managed, last checked and last updated times, observed generation, and conditions.
* **Recent Updates tab**: Displays updates from the last reconciliation cycle, including alias, image, new version, applications updated, time, and message, in a paginated table. See [Filter, search, and paginate resources](filter-resources.md).
* **YAML tab**: Provides a live manifest editor for the ImageUpdater resource.
