import React, { ButtonHTMLAttributes, FC, MouseEventHandler, PropsWithChildren } from 'react';
import styled from 'styled-components';
import Codicon from '../Codicon';
import BaseButton from '../base/button';

const Wrapper = styled.div`
  display: flex;
  width: max-content;
  height: 16px;
`;

const MainButton = styled(BaseButton)<{ $withDropdown: boolean }>`
  flex-grow: 1;
  border-top-right-radius: ${({ $withDropdown }) => ($withDropdown ? 0 : '2px')};
  border-bottom-right-radius: ${({ $withDropdown }) => ($withDropdown ? 0 : '2px')};
  border-right: none;
  padding: 0 5px;
  background-color: ${({ theme }) => theme['extensionButton.background']};

  font-size: 11px;
  color: ${({ theme }) => theme['extensionButton.prominentForeground']};

  &:hover {
    background-color: ${({ theme }) => theme['extensionButton.hoverBackground']};
  }
  &:focus {
    outline-offset: 1px;
  }
`;

const Separator = styled.div`
  display: flex;
  align-items: center;
  min-width: 1px;
  width: 1px;
  height: 100%;
  padding: 3px 0;
  background-color: ${({ theme }) => theme['extensionButton.background']};
  & > div {
    width: 100%;
    height: 100%;
    background-color: ${({ theme }) => theme['extensionButton.separator']};
  }
`;

const DropdownButton = styled(BaseButton)`
  width: 16px;
  height: 100%;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-left: none;

  color: ${({ theme }) => theme['extensionButton.prominentForeground']};

  background-color: ${({ theme }) => theme['extensionButton.background']};
  &:hover {
    background-color: ${({ theme }) => theme['extensionButton.hoverBackground']};
  }
  &:focus {
    outline-offset: 1px;
  }
`;

interface IExtensionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onDropdownClick?: MouseEventHandler<HTMLButtonElement>;
}

const ExtensionButton: FC<PropsWithChildren<IExtensionButtonProps>> = ({
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

export default ExtensionButton;
