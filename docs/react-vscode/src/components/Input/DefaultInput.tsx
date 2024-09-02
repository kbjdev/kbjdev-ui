import React, { FC } from 'react';
import { Input } from '@kbjdev/react-vscode';

const DefaultInput: FC = () => (
  <Input placeholder="Search files by name (append : to go to line or @ to go to symbol)" />
);

export default DefaultInput;
