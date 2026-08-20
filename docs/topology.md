# Topology view

The GitOps Console plugin includes graphical views for Applications, ApplicationSets, and Rollouts.

## Application resource graph

On an Application, open the **Resources** tab.

The graph and table show immediate managed resources for the Application, not the full Argo CD resource tree.

* Pan, zoom, and select resources. Status filters apply to both the table and the graph.
* Related resources of the same kind can be grouped or ungrouped.
* Context-menu actions on graph nodes include viewing details, editing labels and annotations, deleting resources, and viewing resources in Argo CD.
* Use the Argo CD link on the tab to open the complete resource hierarchy in the Argo CD UI.

## ApplicationSet graphical view

On an ApplicationSet, open the **Applications** tab. The graphical view shows generated applications. When progressive sync is enabled, you can show the progressive sync flow from one step to the next.

## Rollouts in Developer Topology

The OpenShift Console Topology view shows Rollout instances:

* Rollout **Details** and **Overview** sidebar tabs
* Context actions for Rollout resources
* A visual decorator on Rollout nodes

On a Rollout details page, use the Topology link to open this view.
