import Link from 'next/link';

import styles from './styles.module.scss';

export function Header() {
  return (
    <header className={styles.container}>
      <Link href="/">
        <a>
          <img alt="Spacetraveling logo" src="/images/logo.svg" />
        </a>
      </Link>
    </header>
  );
}
