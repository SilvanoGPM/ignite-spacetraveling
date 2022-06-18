import { Header } from 'components/Header';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { NextSeo } from 'next-seo';
import { PrismicDocument } from '@prismicio/types';
import Link from 'next/link';

import { getPrismicClient } from 'services/prismic';
import { dateFormatter, dateTimeFormatter } from 'utils/formatters';
import { Comments } from 'components/Comments';

import styles from './styles.module.scss';
import commonStyles from '../../styles/common.module.scss';

interface Post {
  slug: string;
  author: string;
  publicatedAt: string;
  updatedAt: string;
  title: string;
  subTitle: string;
  banner: string;
  content: Array<{ heading: string; body: string }>;
  timeReading: string;
}

export interface PostProps {
  post: Post;
  nextPost?: Post | null;
  prevPost?: Post | null;
}

const HUMAN_WORDS_PER_MINUTE_AVG = 200;

export default function Post({ post, nextPost, prevPost }: PostProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Carregando...</h1>;
  }

  return (
    <>
      <NextSeo
        title={`${post.title} - Spacetraveling`}
        description={post.subTitle}
        canonical="https://spacetraveling-sky.netlify.app/"
        openGraph={{
          url: 'https://spacetraveling-sky.netlify.app/',
          title: `${post.title} - Spacetraveling`,
          description: post.subTitle,
          images: [
            {
              url: post.banner,
              width: 1280,
              height: 720,
              alt: post.title,
            },
          ],
        }}
      />

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

        <div className={commonStyles.maxWidth}>
          <hr className={styles.divider} />
        </div>

        <div className={`${commonStyles.maxWidth} ${styles.postsNavigation}`}>
          {prevPost ? (
            <div className={styles.navigationItem}>
              <p title={prevPost.title}>{prevPost.title}</p>
              <Link href={`/post/${prevPost.slug}`}>
                <a>Post anterior</a>
              </Link>
            </div>
          ) : (
            <div style={{ flex: 1 }} />
          )}

          {nextPost && (
            <div className={styles.navigationItem}>
              <p title={nextPost.title}>{nextPost.title}</p>
              <Link href={`/post/${nextPost.slug}`}>
                <a className={styles.nextPost}>Próximo post</a>
              </Link>
            </div>
          )}
        </div>

        <div className={commonStyles.maxWidth}>
          <Comments />
        </div>
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPost(post: PrismicDocument<Record<string, any>, string, string>) {
  return {
    slug: post.uid,
    title: post.data.title,
    subTitle: post.data.subtitle,
    author: post.data.author,
    publicatedAt: dateFormatter(new Date(post.first_publication_date)),
    updatedAt: dateTimeFormatter(new Date(post.last_publication_date)),
    banner: post.data.banner.url,
  };
}

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
    ...mapPost(response),
    timeReading: `${timeReading} min`,
    content,
  };

  const nextPostResponse = await prismic.getByType('post', {
    pageSize: 1,
    orderings: 'document.first_publication_date',
    after: response.id,
  });

  const prevPostResponse = await prismic.getByType('post', {
    pageSize: 1,
    orderings: 'document.first_publication_date desc',
    after: response.id,
  });

  const nextPost = nextPostResponse.results[0]
    ? mapPost(nextPostResponse.results[0])
    : null;

  const prevPost = prevPostResponse.results[0]
    ? mapPost(prevPostResponse.results[0])
    : null;

  return {
    props: {
      post,
      nextPost,
      prevPost,
    },

    revalidate: 60 * 60, // one hour
  };
};
