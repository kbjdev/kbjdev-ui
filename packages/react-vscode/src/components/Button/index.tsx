import React, { ButtonHTMLAttributes, FC, MouseEventHandler, PropsWithChildren } from 'react';
import styled from 'styled-components';
import BaseButton from '../../base/button';
import Codicon from '../Codicon';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 28px;
`;

const MainButton = styled(BaseButton)<{ $withDropdown: boolean }>`
  flex-grow: 1;
  border-top-right-radius: ${({ $withDropdown }) => ($withDropdown ? 0 : '2px')};
  border-bottom-right-radius: ${({ $withDropdown }) => ($withDropdown ? 0 : '2px')};
  border-right: none;
`;

const Separator = styled.div`
  display: flex;
  align-items: center;
  min-width: 1px;
  width: 1px;
  height: 100%;
  padding: 4px 0;
  background-color: ${({ theme }) => theme['button.background']};
  & > div {
    width: 100%;
    height: 100%;
    background-color: ${({ theme }) => theme['button.separator']};
  }
`;

const DropdownButton = styled(BaseButton)`
  width: 25px;
  height: 100%;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-left: none;
`;

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onDropdownClick?: MouseEventHandler<HTMLButtonElement>;
}

const Button: FC<PropsWithChildren<IButtonProps>> = ({
  children,
  onDropdownClick,
  style,
  type = 'button',
  ...props
}) => {
  const withDropdown = Boolean(onDropdownClick);

  return (
    <Wrapper style={style}>
      <MainButton type={type} $withDropdown={withDropdown} {...props}>
        {children}
      </MainButton>
      {withDropdown && (
        <>
          <Separator>
            <div />
          </Separator>
          <DropdownButton onClick={onDropdownClick}>
            <Codicon name="chevron-down" />
          </DropdownButton>
        </>
      )}
    </Wrapper>
  );
};

export default Button;
