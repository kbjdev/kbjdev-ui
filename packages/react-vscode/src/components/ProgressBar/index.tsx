import React, { FC } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 2px;
  overflow: hidden;
`;

const Bar = styled(motion.div)`
  height: 100%;
  background-color: ${({ theme }) => theme['progressBar.background']};
`;

interface IProgressBarProps {
  value?: number;
}

const ProgressBar: FC<IProgressBarProps> = ({ value }) => (
  <Container>
    <Bar
      style={{ width: `${(value ?? 0.02) * 100}%` }}
      animate={
        typeof value === 'undefined'
          ? {
              x: [0, '2500%', '4900%'],
              scaleX: [1, 3, 1],
              transition: {
                duration: 4,
                ease: 'linear',
                repeat: Infinity,
              },
            }
          : undefined
      }
    />
  </Container>
);

export default ProgressBar;
