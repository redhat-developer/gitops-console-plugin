import { renderToStaticMarkup } from 'react-dom/server';
import { createRef } from 'react';
import DropdownToggle from './DropDownToggle';
import KebabToggle from './KebabToggle';
import SelectToggle from './SelectToggle';

describe('DropdownToggle', () => {
  it('renders with children', () => {
    const Toggle = DropdownToggle({ children: 'Actions' });
    expect(renderToStaticMarkup(<>{Toggle(createRef())}</>)).toMatchInlineSnapshot(
      `"<button>Actions</button>"`,
    );
  });
});

describe('KebabToggle', () => {
  it('renders plain variant with ellipsis icon', () => {
    const Toggle = KebabToggle({});
    expect(renderToStaticMarkup(<>{Toggle(createRef())}</>)).toMatchInlineSnapshot(
      `"<button data-variant="plain"><svg data-icon="EllipsisVIcon"></svg></button>"`,
    );
  });
});

describe('SelectToggle', () => {
  it('renders with selected value', () => {
    const Toggle = SelectToggle({ selected: 'Option A' });
    expect(renderToStaticMarkup(<>{Toggle(createRef())}</>)).toMatchInlineSnapshot(
      `"<button>Option A</button>"`,
    );
  });
});
