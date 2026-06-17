// @ts-ignore — React is used by JSX but react-jsx transform flags it as unused
import * as React from 'react';

export type K8sResourceCommon = {
  apiVersion?: string;
  kind?: string;
  metadata?: {
    name?: string;
    namespace?: string;
    labels?: Record<string, string>;
    annotations?: Record<string, string>;
    deletionTimestamp?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

export const k8sListItems = jest.fn();

export const K8sResourceConditionStatus = {
  True: 'True',
  False: 'False',
  Unknown: 'Unknown',
};

export const getGroupVersionKindForModel = jest.fn(
  (model: any) => `${model.apiGroup || 'core'}~${model.apiVersion}~${model.kind}`,
);

export const useAccessReview = jest.fn(() => [true, true]);

export type ColoredIconProps = {
  className?: string;
  title?: string;
};

export const GreenCheckCircleIcon = ({ className, title }: any) => (
  <svg data-icon="GreenCheckCircleIcon" className={className} aria-label={title} />
);
export const BlueInfoCircleIcon = ({ className, title }: any) => (
  <svg data-icon="BlueInfoCircleIcon" className={className} aria-label={title} />
);
export const RedExclamationCircleIcon = ({ className, title }: any) => (
  <svg data-icon="RedExclamationCircleIcon" className={className} aria-label={title} />
);
export const YellowExclamationTriangleIcon = ({ className, title }: any) => (
  <svg data-icon="YellowExclamationTriangleIcon" className={className} aria-label={title} />
);

export const CamelCaseWrap = ({ value }: { value: string }) => value || '';
export const Timestamp = ({ timestamp }: { timestamp: string }) => timestamp || '';
export const ResourceLink = ({ kind, name, namespace, groupVersionKind }: any) =>
  `[${groupVersionKind ? `${groupVersionKind.kind}` : kind}] ${name}`;

export const k8sUpdate = jest.fn((opts: any) => Promise.resolve(opts.data));
export const k8sPatch = jest.fn((opts: any) => Promise.resolve(opts.resource));

export enum Operator {
  Exists = 'Exists',
  DoesNotExist = 'DoesNotExist',
  In = 'In',
  NotIn = 'NotIn',
  Equals = 'Equals',
  NotEquals = 'NotEquals',
  GreaterThan = 'GreaterThan',
  LessThan = 'LessThan',
  NotEqual = 'NotEqual',
}

export type K8sModel = any;
export type Selector = any;
export type K8sResourceCondition = any;
export type K8sResourceKind = any;
export type K8sResourceKindReference = string;
export type GroupVersionKind = string;
export type K8sVerb = string;
export type SetFeatureFlag = (flag: string, value: boolean) => void;
export type MatchLabels = Record<string, string>;
export type ObjectMetadata = any;
export type NodeAddress = any;
export type NodeCondition = any;
export type ObjectReference = any;
export type TaintEffect = string;
export type OwnerReference = {
  apiVersion: string;
  kind: string;
  name: string;
  uid: string;
};
export type Action = {
  id: string;
  label: string;
  description?: string;
  cta?: () => void;
  disabled?: boolean;
  icon?: any;
  accessReview?: any;
};

export enum AllPodStatus {
  Running = 'Running',
  NotReady = 'Not Ready',
  Warning = 'Warning',
  Empty = 'Empty',
  Failed = 'Failed',
  Pending = 'Pending',
  Succeeded = 'Succeeded',
  Terminating = 'Terminating',
  Unknown = 'Unknown',
  ScaledTo0 = 'Scaled to 0',
  Idle = 'Idle',
  AutoScaledTo0 = 'Autoscaled to 0',
  ScalingUp = 'Scaling Up',
  CrashLoopBackOff = 'CrashLoopBackOff',
}
