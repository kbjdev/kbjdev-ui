import React from 'react';
import { ScrollBox } from '@kbjdev/react-vscode';
import type { Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Box/ScrollBox',
  component: ScrollBox,
  decorators: [
    // eslint-disable-next-line @typescript-eslint/naming-convention
    (Story) => (
      <div style={{ width: 300, height: 400 }}>
        <Story />
      </div>
    ),
  ],
};

export { default as Default } from './DefaultScrollBox';
export { default as HorizontalScrollBox } from './HorizontalScrollBox';
export { default as LargeSizeScrollBox } from './LargeSizeScrollBox';

export default meta;
