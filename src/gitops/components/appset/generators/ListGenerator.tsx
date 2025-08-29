import * as React from 'react';
import { ExpandableSection, DataList, DataListItem, DataListCell, DataListItemRow, DataListItemCells } from '@patternfly/react-core';
import { ListIcon } from '@patternfly/react-icons';
import GeneratorView from './GeneratorView';

interface ListGeneratorProps {
  generator: any;
}

const ListGenerator: React.FC<ListGeneratorProps> = ({ generator }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const onToggle = (_event: React.MouseEvent, isExpanded: boolean) => {
    setIsExpanded(isExpanded);
  };

  const displayValue = (value: any) => {
    if (value === undefined) return "null";
    else if (typeof value === "object") return JSON.stringify(value);
    else return value;
  };

  return (
    <GeneratorView icon={<ListIcon />} title="List">
      <ExpandableSection 
        toggleText={`${generator.elements.length} element(s) in list`} 
        onToggle={onToggle} 
        isExpanded={isExpanded}
      >
        {generator.elements && generator.elements.length > 0 && (
          <DataList aria-label="List generator elements">
            {generator.elements.map((item: any, rowIndex: number) => (
              <DataListItem key={rowIndex}>
                <DataListItemRow>
                  <DataListItemCells
                    dataListCells={Object.entries(item).map(([key, val]: [string, any], colIndex: number) => (
                      <DataListCell key={colIndex}>
                        <strong>{key}:</strong> {displayValue(val)}
                      </DataListCell>
                    ))}
                  />
                </DataListItemRow>
              </DataListItem>
            ))}
          </DataList>
        )}
      </ExpandableSection>
    </GeneratorView>
  );
};

export default ListGenerator;
