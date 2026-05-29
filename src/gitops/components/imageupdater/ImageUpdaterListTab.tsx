import * as React from 'react';

import ImageUpdaterList from './ImageUpdaterList';

type ImageUpdaterListTabProps = {
  namespace?: string;
  hideNameLabelFilters?: boolean;
  showTitle?: boolean;
};

const ImageUpdaterListTab: React.FC<ImageUpdaterListTabProps> = ({
  namespace,
  hideNameLabelFilters,
  showTitle,
}) => {
  return (
    <ImageUpdaterList
      namespace={namespace}
      hideNameLabelFilters={hideNameLabelFilters}
      showTitle={showTitle}
    />
  );
};

export default ImageUpdaterListTab;
