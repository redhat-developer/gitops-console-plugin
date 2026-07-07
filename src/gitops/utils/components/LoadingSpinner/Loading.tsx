import * as React from 'react';
import classNames from 'classnames';

import { Spinner } from '@patternfly/react-core';

export const Loading: React.FunctionComponent<LoadingProps> = ({ className, isInline }) => (
  <div
    className={classNames('co-m-loader', { 'co-m-loader--inline': isInline }, className)}
    data-test="loading-indicator"
  >
    <Spinner aria-live="polite" aria-busy="true" isInline={isInline} size="lg" />
  </div>
);

export const LoadingInline: React.FunctionComponent = () => <Loading isInline />;
LoadingInline.displayName = 'LoadingInline';

Loading.displayName = 'Loading';

type LoadingProps = {
  className?: string;
  isInline?: boolean;
};
