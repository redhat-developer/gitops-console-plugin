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
    ApplicationSetList: "./gitops/components/application/ApplicationSetListTab.tsx",
    ApplicationSetDetailsPage: "./gitops/components/application/ApplicationSetDetailsPage.tsx",
    yamlApplicationTemplates: "./gitops/components/application/templates/index.ts"
  }
};

export default metadata;
