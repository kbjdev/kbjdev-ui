import React from 'react';
import { Button } from '@kbjdev/react-vscode';
import type { Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Button/Button',
  component: Button,
  decorators: [
    // eslint-disable-next-line @typescript-eslint/naming-convention
    (Story) => (
      <div style={{ width: 300 }}>
        <Story />
      </div>
    ),
  ],
};

export { default as Default } from './DefaultButton';
export { default as WithDropdown } from './WithDropdownButton';

export default meta;
