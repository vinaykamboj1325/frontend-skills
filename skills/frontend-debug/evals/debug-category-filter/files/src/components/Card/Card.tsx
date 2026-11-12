import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Card.module.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: ReactNode;
  padded?: boolean;
}

export function Card({ title, padded = true, className, children, ...rest }: CardProps) {
  const classes = [styles.card, padded && styles.padded, className].filter(Boolean).join(' ');
  return (
    <div className={classes} {...rest}>
      {title ? <h3 className={styles.title}>{title}</h3> : null}
      {children}
    </div>
  );
}
