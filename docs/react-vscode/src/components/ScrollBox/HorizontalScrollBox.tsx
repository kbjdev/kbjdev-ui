import React, { FC } from 'react';
import { ScrollBox } from '@kbjdev/react-vscode';
import styled from 'styled-components';

const Panel = styled.div`
  width: 500px;
  height: 250px;
  background-color: ${({ theme }) => theme['sideBar.background']};
`;

const HorizontalScrollBox: FC = () => (
  <Panel>
    <ScrollBox direction="horizontal">
      <div style={{ display: 'flex', height: '100%', width: 'max-content' }}>
        <div style={{ height: '100%', width: 300 }}></div>
        <div style={{ height: '100%', width: 300 }}></div>
        <div style={{ height: '100%', width: 300 }}></div>
        <div style={{ height: '100%', width: 300 }}></div>
        <div style={{ height: '100%', width: 300 }}></div>
      </div>
    </ScrollBox>
  </Panel>
);

export default HorizontalScrollBox;
