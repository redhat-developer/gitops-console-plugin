import { renderToStaticMarkup } from 'react-dom/server';
import ActionDropdownItem from './ActionDropDownItem';

const noop = () => {};

describe('ActionDropdownItem', () => {
  it('renders basic action', () => {
    expect(
      renderToStaticMarkup(
        <ActionDropdownItem
          action={{ id: 'edit', label: 'Edit Resource', cta: noop }}
          setIsOpen={noop as any}
        />,
      ),
    ).toMatchInlineSnapshot(
      `"<li data-disabled="false" data-test-id="edit" class="">Edit Resource</li>"`,
    );
  });

  it('renders action with description', () => {
    expect(
      renderToStaticMarkup(
        <ActionDropdownItem
          action={
            { id: 'delete', label: 'Delete', description: 'Remove this resource', cta: noop } as any
          }
          setIsOpen={noop as any}
        />,
      ),
    ).toMatchInlineSnapshot(
      `"<li data-disabled="false" data-test-id="delete" class="">Delete<small>Remove this resource</small></li>"`,
    );
  });

  it('renders disabled action', () => {
    expect(
      renderToStaticMarkup(
        <ActionDropdownItem
          action={{ id: 'delete', label: 'Delete', disabled: true, cta: noop } as any}
          setIsOpen={noop as any}
        />,
      ),
    ).toMatchInlineSnapshot(
      `"<li data-disabled="true" data-test-id="delete" class="">Delete</li>"`,
    );
  });

  it('renders action with icon', () => {
    expect(
      renderToStaticMarkup(
        <ActionDropdownItem
          action={{ id: 'star', label: 'Star', icon: '*', cta: noop } as any}
          setIsOpen={noop as any}
        />,
      ),
    ).toMatchInlineSnapshot(
      `"<li data-disabled="false" data-test-id="star" class="">Star <span class="text-muted">*</span></li>"`,
    );
  });
});
