import React, { FC } from 'react';
import { ScrollBox } from '@kbjdev/react-vscode';
import styled from 'styled-components';

const Panel = styled.div`
  width: 250px;
  height: 500px;
  background-color: ${({ theme }) => theme['sideBar.background']};
`;

const LargeSizeScrollBox: FC = () => (
  <Panel>
    <ScrollBox sliderSize="large">
      <div style={{ width: '100%', height: 300 }}></div>
      <div style={{ width: '100%', height: 300 }}></div>
      <div style={{ width: '100%', height: 300 }}></div>
      <div style={{ width: '100%', height: 300 }}></div>
      <div style={{ width: '100%', height: 300 }}></div>
    </ScrollBox>
  </Panel>
);

export default LargeSizeScrollBox;
