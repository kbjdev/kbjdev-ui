import styled from 'styled-components';
import { Color } from '../utils/vs/color';

const BaseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 4px;
  background-color: ${({ theme }) => theme['button.background']};
  border: 1px solid ${({ theme }) => theme['button.border'] ?? Color.transparent.toString()};
  border-radius: 2px;
  cursor: pointer;

  font-size: 13px;
  color: ${({ theme }) => theme['button.foreground'] ?? theme.foreground};

  &:hover {
    background-color: ${({ theme }) => theme['button.hoverBackground']};
  }

  &:focus-visible {
    outline: 1px solid ${({ theme }) => theme.focusBorder};
    outline-offset: -1px;
  }

  & > .codicon {
    font-size: 16px;
    margin: 0 0.2em;
  }
`;

export default BaseButton;
