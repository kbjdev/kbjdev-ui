import React from 'react';
import { ProgressBar } from '@kbjdev/react-vscode';
import type { Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  decorators: [
    // eslint-disable-next-line @typescript-eslint/naming-convention
    (Story) => (
      <div style={{ width: 450 }}>
        <Story />
      </div>
    ),
  ],
};

export { default as Default } from './DefaultProgressBar';
export { default as IndeterminateProgressBar } from './IndeterminateProgressBar';

export default meta;
