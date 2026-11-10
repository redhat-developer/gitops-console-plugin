import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import { CardTitle, Divider, Flex, FlexItem, Label } from '@patternfly/react-core';

interface InfrastructureCardTitleProps {
  title: string;
  total: number;
  titleDescription?: string;
  showDivider?: boolean;
  alignTotal?: 'left' | 'center' | 'right';
  showTotal?: boolean;
}

const InfrastructureCardTitle: React.FC<InfrastructureCardTitleProps> = ({
  title,
  total,
  titleDescription,
  showDivider = true,
  alignTotal = 'right',
  showTotal = true,
}) => {
  const flexValue =
    alignTotal === 'right' ? ({ default: 'flex_1' } as const) : ({ default: 'flexNone' } as const);
  return (
    <CardTitle>
      <Flex spaceItems={{ default: 'spaceItemsSm' }} alignItems={{ default: 'alignItemsCenter' }}>
        <Flex
          flex={flexValue}
          direction={{ default: 'row' }}
          spaceItems={{ default: 'spaceItemsSm' }}
        >
          <FlexItem>{title}</FlexItem>
          {titleDescription && (
            <FlexItem style={{ fontSize: '70%' }}>
              <span>{titleDescription}</span>
            </FlexItem>
          )}
        </Flex>
        {showTotal && (
          <Flex>
            <FlexItem style={{ flexShrink: '0' }}>
              <Flex
                spaceItems={{ default: 'spaceItemsXs' }}
                flexWrap={{ default: 'nowrap' }}
                alignItems={{ default: 'alignItemsCenter' }}
              >
                <FlexItem>
                  <span style={{ fontSize: '90%' }}>{t('Total:')}</span>
                </FlexItem>
                <FlexItem>
                  <Label
                    className="gitops-dashboard__label-with-external-link"
                    isCompact
                    variant="filled"
                    color={'grey'}
                  >
                    {total}
                  </Label>
                </FlexItem>
              </Flex>
            </FlexItem>
          </Flex>
        )}
      </Flex>
      {showDivider && (
        <Divider
          orientation={{ default: 'horizontal', lg: 'horizontal' }}
          component="hr"
          style={{ margin: '5px 0px 1px 0px' }}
        />
      )}
    </CardTitle>
  );
};

export default InfrastructureCardTitle;
