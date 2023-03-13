import { K8sKind } from '@openshift-console/dynamic-plugin-sdk';

export const ConsoleLinkModel: K8sKind = {
  label: 'ConsoleLink',
  // t('plugin__gitops-plugin~ConsoleLink')
  labelKey: 'plugin__gitops-plugin~ConsoleLink',
  labelPlural: 'ConsoleLinks',
  // t('plugin__gitops-plugin~ConsoleLinks')
  labelPluralKey: 'plugin__gitops-plugin~ConsoleLinks',
  apiVersion: 'v1',
  apiGroup: 'console.openshift.io',
  plural: 'consolelinks',
  abbr: 'CL',
  namespaced: false,
  kind: 'ConsoleLink',
  id: 'consolelink',
  crd: true,
};
