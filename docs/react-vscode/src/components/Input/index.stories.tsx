import React from 'react';
import { Input } from '@kbjdev/react-vscode';
import type { Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Input',
  component: Input,
  decorators: [
    // eslint-disable-next-line @typescript-eslint/naming-convention
    (Story) => (
      <div style={{ width: 240 }}>
        <Story />
      </div>
    ),
  ],
};

export { default as Default } from './DefaultInput';
export { default as WithActionsInput } from './WithActionsInput';

export default meta;
