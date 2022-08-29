import { K8sKind } from "@openshift-console/dynamic-plugin-sdk";

export const ConsoleLinkModel: K8sKind = {
    label: 'ConsoleLink',
    // t('public~ConsoleLink')
    labelKey: 'public~ConsoleLink',
    labelPlural: 'ConsoleLinks',
    // t('public~ConsoleLinks')
    labelPluralKey: 'public~ConsoleLinks',
    apiVersion: 'v1',
    apiGroup: 'console.openshift.io',
    plural: 'consolelinks',
    abbr: 'CL',
    namespaced: false,
    kind: 'ConsoleLink',
    id: 'consolelink',
    crd: true,
  };
  