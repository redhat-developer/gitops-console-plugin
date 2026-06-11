import * as React from 'react';

export const Table: React.FC<any> = ({ children, ...props }) => <table {...props}>{children}</table>;
export const Thead: React.FC<any> = ({ children }) => <thead>{children}</thead>;
export const Tbody: React.FC<any> = ({ children }) => <tbody>{children}</tbody>;
export const Tr: React.FC<any> = ({ children, ...props }) => <tr {...props}>{children}</tr>;
export const Th: React.FC<any> = ({ children }) => <th>{children}</th>;
export const Td: React.FC<any> = ({ children, dataLabel, ...props }) => (
  <td data-label={dataLabel} {...props}>{children}</td>
);
