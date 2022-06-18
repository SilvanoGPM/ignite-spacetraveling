import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { GetStaticPropsContext } from 'next';
import singletonRouter from 'next/router';
import { ParsedUrlQuery } from 'querystring';

import Home, { getStaticProps, HomeProps } from '../../pages';
import { getPrismicClient } from '../../services/prismic';
import { dateFormatter } from '../../utils/formatters';

interface GetStaticPropsResult {
  props: HomeProps;
}

jest.mock('next/dist/client/router', () => require('next-router-mock'));
jest.mock('@prismicio/client');
jest.mock('../../services/prismic');

const mockedPrismic = getPrismicClient as jest.Mock;
const mockedFetch = jest.spyOn(window, 'fetch') as jest.Mock;

const mockedGetByTypeReturn = {
  next_page: 'link',
  results: [
    {
      uid: 'como-utilizar-hooks',
      first_publication_date: '2022-06-18T19:25:28+0000',
      data: {
        title: 'Como utilizar Hooks',
        subtitle: 'Pensando em sincronização em vez de ciclos de vida',
        author: 'Silvano Marques',
      },
    },
    {
      uid: 'criando-um-app-cra-do-zero',
      first_publication_date: '2022-06-17T19:27:35+0000',
      data: {
        title: 'Criando um app CRA do zero',
        subtitle:
          'Tudo sobre como criar a sua primeira aplicação utilizando Create React App',
        author: 'Gabriel Carvalho',
      },
    },
  ],
};

const mockedData = {
  next_page: mockedGetByTypeReturn.next_page,
  results: mockedGetByTypeReturn.results.map((post) => ({
    slug: post.uid as string,
    title: post.data.title as string,
    subTitle: post.data.subtitle as string,
    updatedAt: dateFormatter(new Date(post.first_publication_date)),
    author: post.data.author as string,
  })),
};

describe('<Home />', () => {
  beforeAll(() => {
    mockedPrismic.mockReturnValue({
      getByType: () => {
        return Promise.resolve(mockedGetByTypeReturn);
      },
    });

    mockedFetch.mockImplementation(() => {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            next_page: null,
            results: [
              {
                uid: 'criando-um-app-cra-do-zero',
                first_publication_date: '2022-06-17T19:27:35+0000',
                data: {
                  title: 'Criando um app CRA do zero',
                  subtitle:
                    'Tudo sobre como criar a sua primeira aplicação utilizando Create React App',
                  author: 'Gabriel Carvalho',
                },
              },
            ],
          }),
      });
    });
  });

  it('should be able to return primisc posts documents usigns getStaticProps', async () => {
    const expectedResponse = { ...mockedGetByTypeReturn };

    const getStaticPropsContext: GetStaticPropsContext<ParsedUrlQuery> = {};

    const { props } = (await getStaticProps(
      getStaticPropsContext,
    )) as GetStaticPropsResult;

    expect(props.data.next_page).toEqual(expectedResponse.next_page);

    expect(props.data.results).not.toBeNull();

    expect(props.data.results.length).toEqual(2);

    expect(props.data.results[0].slug).toEqual(expectedResponse.results[0].uid);
    expect(props.data.results[1].slug).toEqual(expectedResponse.results[1].uid);
  });

  it('should be able to render posts document info', () => {
    render(<Home data={mockedData} />);

    screen.getByText(/como utilizar hooks/i);

    screen.getByText(/pensando em sincronização em vez de ciclos de vida/i);

    screen.getByText(/18 jun 2022/i);
    screen.getByText(/silvano marques/i);

    screen.getByText(/criando um app cra do zero/i);

    screen.getByText(
      /tudo sobre como criar a sua primeira aplicação utilizando create react app/i,
    );

    screen.getByText(/17 jun 2022/i);
    screen.getByText(/gabriel carvalho/i);
  });

  it('should be able to navigate to post after a click in title', () => {
    render(<Home data={mockedData} />);

    const firstPostTitle = screen.getByText(/como utilizar hooks/i);
    const secondPostTitle = screen.getByText(/criando um app cra do zero/i);

    fireEvent.click(firstPostTitle);

    expect(singletonRouter).toMatchObject({
      asPath: '/post/como-utilizar-hooks',
    });

    fireEvent.click(secondPostTitle);

    expect(singletonRouter).toMatchObject({
      asPath: '/post/criando-um-app-cra-do-zero',
    });
  });

  it('should be able to load more posts if available', async () => {
    const data = {
      ...mockedData,
      results: [
        {
          slug: 'como-utilizar-hooks',
          updatedAt: '2022-06-18T19:25:28+0000',
          title: 'Como utilizar Hooks',
          subTitle: 'Pensando em sincronização em vez de ciclos de vida',
          author: 'Silvano Marques',
        },
      ],
    };

    render(<Home data={data} />);

    screen.getByText(/como utilizar hooks/i);

    const loadMorePostsButton = screen.getByText(/carregar mais posts/i);

    fireEvent.click(loadMorePostsButton);

    await waitFor(
      () => {
        expect(mockedFetch).toHaveBeenCalled();
        screen.getByText(/criando um app cra do zero/i);
      },
      { timeout: 200 },
    );
  });

  it('should not be able to load more posts if not available', () => {
    const data = { ...mockedData, next_page: null };

    render(<Home data={data} />);

    screen.getByText(/como utilizar hooks/i);
    screen.getByText(/criando um app cra do zero/i);

    const loadMorePostsButton = screen.queryByText(/carregar mais posts/i);

    expect(loadMorePostsButton).not.toBeInTheDocument();
  });
});
