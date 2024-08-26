import React, { FC } from 'react';
import { Button, Codicon } from '@kbjdev/react-vscode';

const WithDropdownButton: FC = () => (
  <Button onDropdownClick={() => {}}>
    <Codicon name="check" />
    Commit
  </Button>
);

export default WithDropdownButton;
