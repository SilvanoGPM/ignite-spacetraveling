import { Header } from 'components/Header';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import { getPrismicClient } from 'services/prismic';
import { dateFormatter, dateTimeFormatter } from 'utils/formatters';
import { Comments } from 'components/Comments';

import styles from './styles.module.scss';
import commonStyles from '../../styles/common.module.scss';

interface PostProps {
  post: {
    slug: string;
    author: string;
    publicatedAt: string;
    updatedAt: string;
    title: string;
    banner: string;
    content: Array<{ heading: string; body: string }>;
    timeReading: number;
  };
}

const HUMAN_WORDS_PER_MINUTE_AVG = 200;

export default function Post({ post }: PostProps) {
  const router = useRouter();

  if (router.isFallback) {
    return 'Carregando...';
  }

  return (
    <>
      <Head>
        <title>Criando um app CRA do zero - Spacetraveling</title>
      </Head>

      <div className={styles.header}>
        <Header />
      </div>

      <main>
        <figure className={styles.banner}>
          <img src={post.banner} alt={post.title} />
        </figure>

        <article className={`${commonStyles.maxWidth} ${styles.post}`}>
          <h1 className={styles.postTitle}>{post.title}</h1>

          <div className={styles.postInfo}>
            <p className={styles.postInfoItem}>
              <FiCalendar size={15} />
              <span>{post.publicatedAt}</span>
            </p>

            <p className={styles.postInfoItem}>
              <FiUser size={15} />
              <span>{post.author}</span>
            </p>

            <p className={styles.postInfoItem}>
              <FiClock size={15} />
              <span>{post.timeReading}</span>
            </p>
          </div>

          <em className={styles.postUpdatedAt}>
            * editado em {post.updatedAt}
          </em>

          {post.content.map((group) => (
            <div key={group.heading} className={styles.postGroup}>
              <h2 className={styles.postGroupHeading}>{group.heading}</h2>

              <div
                dangerouslySetInnerHTML={{ __html: group.body }}
                className={styles.postGroupContent}
              />
            </div>
          ))}
        </article>

        <Comments />
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();

  const { results } = await prismic.getByType('post');

  const paths = results.map((post) => ({
    params: { slug: post.uid as string },
  }));

  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();
  const { slug } = params as { slug: string };

  const response = await prismic.getByUID('post', slug);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content = response.data.content.map((group: any) => ({
    heading: group.heading,
    body: RichText.asHtml(group.body),
  }));

  const totalOfWords = response.data.content.reduce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (total: number, group: any) => {
      const words = RichText.asText(group.body).trim().split(/\s+/).length;
      return total + words;
    },
    0,
  );

  const timeReading = Math.ceil(totalOfWords / HUMAN_WORDS_PER_MINUTE_AVG);

  const post = {
    slug: response.uid,
    title: response.data.title,
    author: response.data.author,
    publicatedAt: dateFormatter(new Date(response.first_publication_date)),
    updatedAt: dateTimeFormatter(new Date(response.last_publication_date)),
    banner: response.data.banner.url,
    timeReading: `${timeReading} min`,
    content,
  };

  return {
    props: { post },
    revalidate: 60 * 60, // one hour
  };
};
