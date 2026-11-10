# Manage table columns

You can choose which columns appear on GitOps tables and resize those columns. Both settings are saved to your console user settings, so they are restored the next time you open the table, including from a different browser or machine.

Two separate toolbar controls manage this:

* **Manage columns** opens a dialog where you show or hide columns. To undo your selection, use **Restore default columns** in that dialog.
* **Reset column widths** clears the widths you set by dragging column borders. It does not change which columns are visible.

These controls are available on the GitOps list pages for Applications, ApplicationSets, AppProjects, ImageUpdaters, and Rollouts, and on these details tables:

* Application details: **Resources** (list view), **Sources** -> **Sync Status** (resources last synced), and **History**
* AppProject details: **Roles**, **Sync Windows**, and **Applications**
* ApplicationSet details: **Applications (list view)**
* ImageUpdater details: **Recent Updates**
* Rollout details: **Pods**

## Prerequisites

* You have access to the OpenShift web console.
* The GitOps Console plugin is enabled.

## Manage columns

Use **Manage columns** to show or hide optional columns on a table.

1. In the OpenShift web console, navigate to **GitOps** and open a resource list page or a details tab that supports column management.

2. In the toolbar, click the **Manage columns** control (columns icon).

   ![Manage columns control in the list page toolbar](assets/pics/manage-columns-toolbar.png)

3. In the **Manage columns** dialog, select or clear columns under:
   * **Default** columns for that table type, for example **Default Application columns**.
   * **Additional columns** (optional columns that are hidden by default). Tables with no optional columns, such as **History** and **Roles**, show **None** here.

   ![Manage columns dialog with Default and Additional columns](assets/pics/manage-columns-dialog.png)

4. Optional: Click **Restore default columns** to return the selection to the defaults for that table.

5. Click **Save** to apply the selection, or **Cancel** to discard changes.

> **NOTE**
>
> The first column of each table is locked and cannot be hidden. On list pages this is **Name**; on details tables it varies, for example **Repository** on the **Sources** tab. The row actions column is always shown and does not appear in the dialog.

> **NOTE**
>
> On list pages, the **Namespace** column is available only when the **Project** dropdown is set to **All Projects**.

Each resource page lists the columns that are available for that list, including which columns are shown by default and which are additional. See:

* [Applications in the GitOps Console](applications.md#table-columns)
* [ApplicationSets in the GitOps Console](applicationsets.md#table-columns)
* [AppProjects in the GitOps Console](appprojects-rbac.md#table-columns)
* [ImageUpdaters in the GitOps Console](image-updaters.md#table-columns)
* [Rollouts in the GitOps Console](rollouts.md#table-columns)

### Details table columns

Details tables use the same dialog. The following table lists the locked column and the optional columns for each one:

| Details table | Locked column | Additional columns |
| --- | --- | --- |
| Application: **Resources** | **Name** | **Sync Wave** |
| Application: **Sources** | **Repository** | **Ref** |
| Application: **Sync Status** | **Name** | **Hook** |
| Application: **History** | **ID** | None |
| AppProject: **Roles** | **Name** | None |
| AppProject: **Sync Windows** | **Kind** | **Clusters**, **Namespaces**, **Time Zone** |
| ImageUpdater: **Recent Updates** | **Alias** | **Message** |
| Rollout: **Pods** | **Name** | **Restarts**, **Memory**, **CPU** |

The **Applications** tab on an ApplicationSet or AppProject details page uses the same columns and the same saved selection as the [Applications list page](applications.md#table-columns). Changing columns in one place changes all three.

## Reset column widths

GitOps tables support resizable columns. Drag a column border to change its width. The console remembers the widths you set for that table. The row actions column cannot be resized.

![Column resize handle on a table column border](assets/pics/resize-column-handle.png)

To clear saved widths for the current table and restore the default layout:

1. Open the list page or details table whose widths you want to reset.

2. In the toolbar, click **Reset column widths** (undo icon).

   ![Reset column widths control in the list page toolbar](assets/pics/reset-column-widths-toolbar.png)

The table returns to the default column widths for that view. Column visibility set with **Manage columns** is not changed.
