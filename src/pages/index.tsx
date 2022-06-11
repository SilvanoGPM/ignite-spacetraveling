import { FiCalendar, FiUser } from 'react-icons/fi';
import Link from 'next/link';

import { Header } from 'components/Header';

import styles from './home.module.scss';
import commonStyles from '../styles/common.module.scss';

export default function Home() {
  return (
    <div className={styles.container}>
      <Header />

      <main className={`${commonStyles.maxWidth} ${styles.postsContainer}`}>
        <section>
          <div className={styles.post}>
            <h2 className={styles.postTitle}>
              <Link href="#">
                <a>Como utilizar Hooks</a>
              </Link>
            </h2>

            <p className={styles.postSubtitle}>
              Pensando em sincronização em vez de ciclos de vida.
            </p>

            <div className={styles.postInfo}>
              <p className={styles.postInfoItem}>
                <FiCalendar size={15} />
                <span>15 Mar 2022</span>
              </p>

              <p className={styles.postInfoItem}>
                <FiUser size={15} />
                <span>Silvano Marques</span>
              </p>
            </div>
          </div>

          <div className={styles.post}>
            <h2 className={styles.postTitle}>
              <Link href="#">
                <a>Como utilizar Hooks</a>
              </Link>
            </h2>

            <p className={styles.postSubtitle}>
              Pensando em sincronização em vez de ciclos de vida.
            </p>

            <div className={styles.postInfo}>
              <p className={styles.postInfoItem}>
                <FiCalendar size={15} />
                <span>15 Mar 2022</span>
              </p>

              <p className={styles.postInfoItem}>
                <FiUser size={15} />
                <span>Silvano Marques</span>
              </p>
            </div>
          </div>

          <div className={styles.post}>
            <h2 className={styles.postTitle}>
              <Link href="#">
                <a>Como utilizar Hooks</a>
              </Link>
            </h2>

            <p className={styles.postSubtitle}>
              Pensando em sincronização em vez de ciclos de vida.
            </p>

            <div className={styles.postInfo}>
              <p className={styles.postInfoItem}>
                <FiCalendar size={15} />
                <span>15 Mar 2022</span>
              </p>

              <p className={styles.postInfoItem}>
                <FiUser size={15} />
                <span>Silvano Marques</span>
              </p>
            </div>
          </div>

          <div className={styles.post}>
            <h2 className={styles.postTitle}>
              <Link href="#">
                <a>Como utilizar Hooks</a>
              </Link>
            </h2>

            <p className={styles.postSubtitle}>
              Pensando em sincronização em vez de ciclos de vida.
            </p>

            <div className={styles.postInfo}>
              <p className={styles.postInfoItem}>
                <FiCalendar size={15} />
                <span>15 Mar 2022</span>
              </p>

              <p className={styles.postInfoItem}>
                <FiUser size={15} />
                <span>Silvano Marques</span>
              </p>
            </div>
          </div>

          <div className={styles.post}>
            <h2 className={styles.postTitle}>
              <Link href="#">
                <a>Como utilizar Hooks</a>
              </Link>
            </h2>

            <p className={styles.postSubtitle}>
              Pensando em sincronização em vez de ciclos de vida.
            </p>

            <div className={styles.postInfo}>
              <p className={styles.postInfoItem}>
                <FiCalendar size={15} />
                <span>15 Mar 2022</span>
              </p>

              <p className={styles.postInfoItem}>
                <FiUser size={15} />
                <span>Silvano Marques</span>
              </p>
            </div>
          </div>
        </section>

        <button className={styles.loadMorePosts}>Carregar mais posts</button>
      </main>
    </div>
  );
}
