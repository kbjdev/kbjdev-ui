import React from 'react';
import { ExtensionButton } from '@kbjdev/react-vscode';
import type { Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Button/ExtensionButton',
  component: ExtensionButton,
};

export { default as Default } from './DefaultExtensionButton';
export { default as WithDropdown } from './WithDropdownExtensionButton';

export default meta;
