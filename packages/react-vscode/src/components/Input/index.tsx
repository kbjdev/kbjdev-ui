import React, {
  FC,
  FocusEventHandler,
  InputHTMLAttributes,
  MouseEvent,
  MouseEventHandler,
  useCallback,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { ellipsisTextCss } from '../../base/text';
import colorGuard from '../../utils/color/colorGuard';
import Codicon, { CodiconName } from '../Codicon';
import ToolbarButton from '../ToolbarButton';

const Wrapper = styled.div<{ $isFocused: boolean }>`
  display: flex;
  width: 100%;
  height: 26px;
  background-color: ${({ theme }) => theme['input.background']};
  color: ${({ theme }) => theme['input.foreground']};
  border: 1px solid
    ${({ theme, $isFocused }) =>
      $isFocused ? theme.focusBorder : colorGuard(theme['input.border'])};
  border-radius: 2px;
`;

const StyledInput = styled.input<{ $hasActions: boolean }>`
  flex: 1;
  padding: 2px ${({ $hasActions }) => ($hasActions ? '8px' : '6px')} 2px 6px;
  background-color: inherit;
  color: ${({ theme }) => theme['input.foreground']};
  height: 100%;

  font-size: 13px;

  &::placeholder {
    color: ${({ theme }) => theme['input.placeholderForeground']};
  }

  &:placeholder-shown {
    ${ellipsisTextCss}
  }
`;

const ActionsBox = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

const InputOptionButton = styled.button<{ $isActive: boolean }>`
  width: 20px;
  height: 20px;
  padding: 1px;
  margin: 1px;
  border: 1px solid
    ${({ theme, $isActive }) => ($isActive ? theme['inputOption.activeBorder'] : 'transparent')};
  border-radius: 3px;
  background-color: ${({ theme, $isActive }) =>
    $isActive ? theme['inputOption.activeBackground'] : 'transparent'};

  font-size: 16px;
  color: ${({ theme, $isActive }) =>
    $isActive ? theme['inputOption.activeForeground'] : theme['icon.foreground']};

  &:hover {
    background-color: ${({ theme, $isActive }) =>
      $isActive ? theme['inputOption.activeBackground'] : theme['inputOption.hoverBackground']};
  }

  &:focus-visible {
    outline: 1px solid ${({ theme }) => theme.focusBorder};
    outline-offset: -1px;
  }
`;

type InputAction =
  | {
      type: 'toolbar-button';
      icon: CodiconName;
      onClick?: MouseEventHandler<HTMLButtonElement>;
      disabled?: boolean;
    }
  | {
      type: 'toggle';
      icon: CodiconName;
      onClick?: MouseEventHandler<HTMLButtonElement>;
      checked?: boolean;
      disabled?: boolean;
    };

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  actions?: InputAction[];
}

const Input: FC<IInputProps> = ({ actions, onFocus, onBlur, ...props }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const hasActions = Boolean(actions && actions?.length > 0);

  const onInputFocus = useCallback<FocusEventHandler<HTMLInputElement>>(
    (event) => {
      setIsFocused(true);
      onFocus?.(event);
    },
    [onFocus]
  );

  const onInputBlur = useCallback<FocusEventHandler<HTMLInputElement>>(
    (event) => {
      setIsFocused(false);
      onBlur?.(event);
    },
    [onBlur]
  );

  const onEachActionClick =
    (onClick?: MouseEventHandler<HTMLButtonElement>) => (event: MouseEvent<HTMLButtonElement>) => {
      inputRef.current?.focus();
      onClick?.(event);
    };

  return (
    <Wrapper $isFocused={isFocused}>
      <StyledInput
        ref={inputRef}
        $hasActions={hasActions}
        onFocus={onInputFocus}
        onBlur={onInputBlur}
        {...props}
      />
      {hasActions && (
        <ActionsBox>
          {actions?.map((action, index) => {
            if (action.type === 'toggle') {
              return (
                <InputOptionButton
                  key={index}
                  $isActive={action.checked ?? false}
                  onClick={onEachActionClick(action.onClick)}
                >
                  <Codicon name={action.icon} />
                </InputOptionButton>
              );
            }

            return (
              <ToolbarButton
                key={index}
                icon={action.icon}
                disabled={action.disabled}
                onClick={onEachActionClick(action.onClick)}
              />
            );
          })}
        </ActionsBox>
      )}
    </Wrapper>
  );
};

export default Input;
