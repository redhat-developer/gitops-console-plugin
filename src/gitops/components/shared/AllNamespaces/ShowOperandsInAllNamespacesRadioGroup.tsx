import * as React from 'react';

import { t } from '@gitops/utils/hooks/useGitOpsTranslation';
import { useShowOperandsInAllNamespaces } from '@gitops-shared/AllNamespaces/useShowOperandsInAllNamespaces';
import { Form, FormGroup, Radio } from '@patternfly/react-core';

export const ShowOperandsInAllNamespacesRadioGroup: React.FC = () => {
  const [showOperandsInAllNamespaces, setShowOperandsInAllNamespaces] =
    useShowOperandsInAllNamespaces();
  return (
    <Form isHorizontal>
      <FormGroup
        role="radiogroup"
        fieldId="show-operands"
        label={t('olm~Show operands in:')}
        isInline
        hasNoPaddingTop
      >
        <Radio
          id="all-namespaces"
          name="show-operands"
          value="true"
          label={t('olm~All namespaces')}
          onChange={() => setShowOperandsInAllNamespaces(true)}
          isChecked={showOperandsInAllNamespaces}
          data-checked-state={showOperandsInAllNamespaces}
        />
        <Radio
          id="current-namespace-only"
          name="show-operands"
          value="false"
          label={t('olm~Current namespace only')}
          onChange={() => setShowOperandsInAllNamespaces(false)}
          isChecked={!showOperandsInAllNamespaces}
          data-checked-state={!showOperandsInAllNamespaces}
        />
      </FormGroup>
    </Form>
  );
};
