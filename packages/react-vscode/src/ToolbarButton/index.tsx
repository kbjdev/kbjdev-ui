import React, { ButtonHTMLAttributes, FC } from 'react';
import styled from 'styled-components';
import Codicon, { CodiconName } from '../Codicon';

const BaseButton = styled.button`
  display: flex;
  align-items: center;
  padding: 3px;
  border-radius: 4px;
  cursor: pointer;

  font-size: 11px;
  color: ${({ theme }) => theme['icon.foreground']};

  &:disabled {
    color: ${({ theme }) => theme.disabledForeground};
    cursor: default;
  }

  &:not(:disabled):hover {
    background-color: ${({ theme }) => theme['toolbar.hoverBackground']};
    outline: ${({ theme }) =>
      theme['toolbar.hoverOutline'] && `1px solid ${theme['toolbar.hoverOutline']}`};
    outline-offset: -1px;
  }

  &:focus-visible {
    outline: 1px solid ${({ theme }) => theme.focusBorder};
    outline-offset: -1px;
  }

  & > .codicon {
    font-size: 16px;
  }
`;

const Label = styled.div`
  margin-left: 4px;
  font-size: 11px;
`;

interface IToolbarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: CodiconName;
  label?: string;
}

const ToolbarButton: FC<IToolbarButtonProps> = ({ icon, label, type = 'button', ...props }) => (
  <BaseButton type={type} {...props}>
    <Codicon name={icon} />
    {label && <Label>{label}</Label>}
  </BaseButton>
);

export default ToolbarButton;
