import React, { FC } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: max-content;
  min-height: 18px;
  min-width: 18px;
  padding: 3px 6px;
  border: ${({ theme }) => theme.contrastBorder && `1px solid ${theme.contrastBorder}`};
  border-radius: 11px;
  background-color: ${({ theme }) => theme['badge.background']};

  font-size: 11px;
  line-height: 11px;
  color: ${({ theme }) => theme['badge.foreground']};
  text-align: center;
`;

interface ICountBadgeProps {
  count: number;
}

const CountBadge: FC<ICountBadgeProps> = ({ count }) => <Container>{count}</Container>;

export default CountBadge;
