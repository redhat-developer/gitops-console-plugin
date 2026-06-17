import { renderToStaticMarkup } from 'react-dom/server';
import {
  GrayUnknownIcon,
  BlueSyncIcon,
  RedResourcesFullIcon,
  YellowResourcesAlmostFullIcon,
  BlueArrowCircleUpIcon,
} from './icons';

describe('plugin status icons', () => {
  it('GrayUnknownIcon', () => {
    expect(renderToStaticMarkup(<GrayUnknownIcon />)).toMatchInlineSnapshot(
      `"<svg data-icon="UnknownIcon" style="color:#000000"></svg>"`,
    );
  });

  it('BlueSyncIcon', () => {
    expect(renderToStaticMarkup(<BlueSyncIcon />)).toMatchInlineSnapshot(
      `"<svg data-icon="SyncAltIcon" style="color:#000000"></svg>"`,
    );
  });

  it('RedResourcesFullIcon', () => {
    expect(renderToStaticMarkup(<RedResourcesFullIcon />)).toMatchInlineSnapshot(
      `"<svg data-icon="ResourcesFullIcon" style="color:#000000"></svg>"`,
    );
  });

  it('YellowResourcesAlmostFullIcon', () => {
    expect(renderToStaticMarkup(<YellowResourcesAlmostFullIcon />)).toMatchInlineSnapshot(
      `"<svg data-icon="ResourcesAlmostFullIcon" style="color:#000000"></svg>"`,
    );
  });

  it('BlueArrowCircleUpIcon', () => {
    expect(renderToStaticMarkup(<BlueArrowCircleUpIcon />)).toMatchInlineSnapshot(
      `"<svg data-icon="ArrowCircleUpIcon" style="color:#000000"></svg>"`,
    );
  });
});
