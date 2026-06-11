import { renderToStaticMarkup } from 'react-dom/server';
import ActionsDropdown from './ActionDropDown';

describe('ActionsDropdown', () => {
  it('renders closed with default toggle', () => {
    expect(
      renderToStaticMarkup(
        <ActionsDropdown
          actions={
            [
              { id: 'edit', label: 'Edit', cta: () => {} },
              { id: 'delete', label: 'Delete', cta: () => {} },
            ] as any
          }
        />,
      ),
    ).toMatchInlineSnapshot(
      `"<div data-testid="dropdown" data-open="false" popperProps="[object Object]"><button>Actions</button></div>"`,
    );
  });

  it('renders with kebab toggle', () => {
    expect(
      renderToStaticMarkup(
        <ActionsDropdown
          actions={[{ id: 'edit', label: 'Edit', cta: () => {} }] as any}
          isKebabToggle
        />,
      ),
    ).toMatchInlineSnapshot(
      `"<div data-testid="dropdown" data-open="false" popperProps="[object Object]"><button data-variant="plain"><svg data-icon="EllipsisVIcon"></svg></button></div>"`,
    );
  });

  it('renders with no actions', () => {
    expect(renderToStaticMarkup(<ActionsDropdown actions={[]} />)).toMatchInlineSnapshot(
      `"<div data-testid="dropdown" data-open="false" popperProps="[object Object]"><button>Actions</button></div>"`,
    );
  });
});
