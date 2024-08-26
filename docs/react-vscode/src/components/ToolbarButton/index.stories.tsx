import React from 'react';
import { ToolbarButton } from '@kbjdev/react-vscode';
import type { Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Components/Button/ToolbarButton',
  component: ToolbarButton,
};

export { default as Default } from './DefaultToolbarButton';
export { default as WithLabelToolbarButton } from './WithLabelToolbarButton';
export { default as DisabledToolbarButton } from './DisabledToolbarButton';

export default meta;
