import React, { FC } from 'react';
import { ExtensionButton } from '@kbjdev/react-vscode';

const WithDropdownExtensionButton: FC = () => (
  <ExtensionButton onDropdownClick={() => {}}>Install</ExtensionButton>
);

export default WithDropdownExtensionButton;
