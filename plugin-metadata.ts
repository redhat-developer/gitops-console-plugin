import { ConsolePluginBuildMetadata } from '@openshift-console/dynamic-plugin-sdk-webpack';

const metadata: ConsolePluginBuildMetadata = {
  dependencies: {
    '@console/pluginAPI': '*',
  },
  name: "gitops-plugin",
  displayName: 'GitOps Plugin',
  version: "0.0.15",
  description: "OpenShift Console Plugin for GitOps",
  exposedModules: {
    "environments": "./components/ApplicationListPage",
    "detailsPage": "./components/EnvironmentDetailsPageTabs",
    "gitopsFlags": "./components/utils/flags",
    "topology": "./components/topology",
    ApplicationList: "./gitops/components/application/ApplicationListTab.tsx",
    ApplicationDetails: "./gitops/components/application/ApplicationNavPage.tsx",
    RolloutList: "./gitops/components/rollout/RolloutListTab.tsx",
    RolloutDetails: "./gitops/components/rollout/RolloutNavPage.tsx",
    ApplicationSetList: "./gitops/components/application/ApplicationSetListTab.tsx",
    ApplicationSetDetailsPage: "./gitops/components/appset/ApplicationSetDetailsPage.tsx",
    ProjectList: "./gitops/components/project/ProjectListTab.tsx",
    yamlTemplates: "./gitops/templates/index.ts"
  }
};

export default metadata;
