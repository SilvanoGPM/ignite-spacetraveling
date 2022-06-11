import Link from 'next/link';

import styles from '../../styles/common.module.scss';

export function Header() {
  return (
    <header className={styles.maxWidth}>
      <Link href="/">
        <a>
          <img alt="Spacetraveling logo" src="/images/logo.svg" />
        </a>
      </Link>
    </header>
  );
}
