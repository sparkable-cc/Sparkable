import styles from './index.module.scss';
import React from 'react';

interface Props {
  link: string;
}

export const ArticleLink = ({ link }: Props) => {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={link}
      className={styles.articleLink}
    >
      {link}
    </a>
  )
}