import React, { FC, useState } from 'react';
import { Input } from '@kbjdev/react-vscode';

const WithActionsInput: FC = () => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', rowGap: '6px' }}>
      <Input
        placeholder="Search Extensions in Marketplace"
        actions={[
          { type: 'toolbar-button', icon: 'clear-all', disabled: true },
          { type: 'toolbar-button', icon: 'filter' },
        ]}
      />
      <Input
        placeholder="Search"
        actions={[
          {
            type: 'toggle',
            icon: 'preserve-case',
            checked: isChecked,
            onClick: () => setIsChecked((v) => !v),
          },
        ]}
        onFocus={(event) => {
          event.currentTarget.placeholder = 'Search (⇅ for history)';
        }}
        onBlur={(event) => {
          event.currentTarget.placeholder = 'Search';
        }}
      />
    </div>
  );
};

export default WithActionsInput;
