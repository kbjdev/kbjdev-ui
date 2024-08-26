import React, { FC, HTMLAttributes } from 'react';
import mapping from '@vscode/codicons/src/template/mapping.json';

type CodiconName = keyof typeof mapping;

interface ICodiconProps extends HTMLAttributes<HTMLDivElement> {
  name: CodiconName;
}

const Codicon: FC<ICodiconProps> = ({ name, className, ...props }) => (
  <span className={`codicon codicon-${name}`.concat(className ? ` ${className}` : '')} {...props} />
);

export default Codicon;
