import { render, screen } from '@testing-library/react';
import { ParsedUrlQuery, parse } from 'querystring';
import { useRouter } from 'next/router';

import {
  GetStaticPropsContext,
  GetStaticPathsContext,
  GetStaticPathsResult,
} from 'next';

import Post, {
  getStaticPaths,
  getStaticProps,
  PostProps,
} from 'pages/post/[slug]';

import { getPrismicClient } from '../../services/prismic';
import { dateFormatter, dateTimeFormatter } from '../../utils/formatters';
import { RichText } from 'prismic-dom';

interface GetStaticPropsResult {
  props: PostProps;
}

jest.mock('@prismicio/client');
jest.mock('../../services/prismic');
jest.mock('next/router');

const mockedUseRouter = useRouter as jest.Mock;
const mockedPrismic = getPrismicClient as jest.Mock;

const mockedGetByTypeReturn = {
  results: [
    {
      uid: 'como-utilizar-hooks',
    },
    {
      uid: 'criando-um-app-cra-do-zero',
    },
  ],
};

const mockedGetAllByTypeReturn = [
  {
    uid: 'como-utilizar-hooks',
  },
  {
    uid: 'criando-um-app-cra-do-zero',
  },
];

const mockedGetByUIDReturn = {
  uid: 'como-utilizar-hooks',
  first_publication_date: '2022-06-17T19:25:28+0000',
  last_publication_date: '2022-06-18T19:25:28+0000',
  data: {
    title: 'Como utilizar Hooks',
    subtitle: 'Pensando em sincronização em vez de ciclos de vida',
    author: 'Silvano Marques',
    banner: {
      url: 'https://images.prismic.io/criando-projeto-do-zero/95494d57-eee2-4adb-9883-befa9829abca_christopher-gower-m_HRfLhgABo-unsplash.jpg?auto=compress,format',
    },
    content: [
      {
        body: [
          {
            type: 'paragraph',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            spans: [],
          },
          {
            type: 'paragraph',
            text: 'Nullam dolor sapien, vulputate eu diam at, condimentum hendrerit tellus. Nam facilisis sodales felis, pharetra pharetra lectus auctor sed.',
            spans: [],
          },
          {
            type: 'paragraph',
            text: 'Ut venenatis mauris vel libero pretium, et pretium ligula faucibus. Morbi nibh felis, elementum a posuere et, vulputate et erat. Nam venenatis.',
            spans: [],
          },
        ],
        heading: 'Proin et varius',
      },
      {
        body: [
          {
            type: 'paragraph',
            text: 'Nulla auctor sit amet quam vitae commodo. Sed risus justo, vulputate quis neque eget, dictum sodales sem. In eget felis finibus, mattis magna a, efficitur ex. Curabitur vitae justo consequat sapien gravida auctor a non risus. Sed malesuada mauris nec orci congue, interdum efficitur urna dignissim. Vivamus cursus elit sem, vel facilisis nulla pretium consectetur. Nunc congue.',
            spans: [
              {
                start: 27,
                end: 32,
                type: 'em',
              },
              {
                start: 365,
                end: 376,
                type: 'strong',
              },
            ],
          },
          {
            type: 'paragraph',
            text: 'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aliquam consectetur massa nec metus condimentum, sed tincidunt enim tincidunt. Vestibulum fringilla risus sit amet massa suscipit eleifend. Duis eget metus cursus, suscipit ante ac, iaculis est. Donec accumsan enim sit amet lorem placerat, eu dapibus ex porta. Etiam a est in leo pulvinar auctor. Praesent sed vestibulum elit, consectetur egestas libero.',
            spans: [],
          },
          {
            type: 'paragraph',
            text: 'Ut varius quis velit sed cursus. Nunc libero ante, hendrerit eget consectetur vel, viverra quis lectus. Sed vulputate id quam nec tristique. Etiam lorem purus, imperdiet et porta in, placerat non turpis. Cras pharetra nibh eu libero ullamcorper, at convallis orci egestas. Fusce ut est tellus. Donec ac consectetur magna, nec facilisis enim. Sed vel tortor consectetur, facilisis felis non, accumsan risus. Integer vel nibh et turpis.',
            spans: [
              {
                start: 141,
                end: 158,
                type: 'hyperlink',
                data: {
                  link_type: 'Media',
                  name: 'christopher-gower-m_HRfLhgABo-unsplash.jpg',
                  kind: 'image',
                  url: 'https://images.prismic.io/criando-projeto-do-zero/95494d57-eee2-4adb-9883-befa9829abca_christopher-gower-m_HRfLhgABo-unsplash.jpg?auto=compress,format',
                  size: '876817',
                  height: '2584',
                  width: '3882',
                },
              },
            ],
          },
          {
            type: 'paragraph',
            text: 'Nam eu sollicitudin neque, vel blandit dui. Aliquam luctus aliquet ligula, sed:',
            spans: [],
          },
          {
            type: 'list-item',
            text: 'Suspendisse ac facilisis leo. Sed nulla odio, aliquam ut lobortis vitae, viverra quis risus. Vivamus pulvinar enim sit amet elit porttitor bibendum. Nulla facilisi. Aliquam libero libero, porta ac justo vitae, dapibus convallis sapien. Praesent a nibh pretium, ultrices urna eget, vulputate felis. Phasellus ac sagittis ipsum, a congue lectus. Integer interdum ut velit vehicula volutpat. Nulla facilisi. Nulla rhoncus metus lorem, sit amet facilisis ipsum faucibus et. Lorem ipsum.',
            spans: [],
          },
          {
            type: 'list-item',
            text: 'Curabitur a rutrum ante. Praesent in justo sagittis, dignissim quam facilisis, faucibus dolor. Vivamus sapien diam, faucibus sed sodales sed, tincidunt quis sem. Donec tempus ipsum massa, ut fermentum ante molestie consectetur. In hac habitasse platea dictumst. Sed non finibus nibh, vitae dapibus arcu. Sed lorem magna, imperdiet non pellentesque et, rhoncus ac enim. Class aptent taciti sociosqu ad litora torquent per conubia.',
            spans: [],
          },
          {
            type: 'paragraph',
            text: 'Praesent ac sapien eros. Suspendisse potenti. Morbi eu ante nibh. Proin dictum, tellus ut molestie tincidunt, urna tortor sodales velit, ut tempor lectus ipsum nec sapien. Nulla nec purus vitae libero aliquet posuere non et sapien. Cras in erat rhoncus, dignissim ligula iaculis, faucibus orci. Donec ligula neque, imperdiet vitae mauris eget, egestas varius massa. Praesent ornare nisi at dui dapibus, ac tristique felis.',
            spans: [],
          },
          {
            type: 'paragraph',
            text: 'Phasellus maximus urna lacus, non imperdiet ex blandit sit amet. Vivamus et tellus est. Mauris ligula elit, placerat non tellus a, dictum porttitor urna. Phasellus mollis turpis id suscipit dapibus. In dolor.',
            spans: [],
          },
          {
            type: 'paragraph',
            text: 'Sed sit amet euismod sapien, non eleifend erat. Vivamus et quam odio. Integer nisi lacus, maximus sit amet turpis in, luctus molestie sem. Duis sit amet euismod erat. Fusce pulvinar ex neque, egestas cursus nulla ullamcorper vel. Pellentesque mollis erat egestas est rhoncus, sit amet sodales massa ullamcorper. Etiam auctor ante a neque facilisis tristique. Proin ultricies fringilla turpis, eget tempus elit imperdiet non. Quisque.',
            spans: [],
          },
          {
            type: 'paragraph',
            text: 'Etiam eu tortor placerat, varius orci non, ornare nunc. Cras suscipit in ligula ultricies lacinia. Pellentesque at tristique sapien, et scelerisque leo. Donec eu nisi at magna tristique luctus vel at turpis. Nam vestibulum ornare ex cursus vulputate. In elementum tellus at sapien bibendum, id maximus mauris convallis. Donec facilisis porta lobortis. Vivamus mauris diam, pretium ac dolor.',
            spans: [],
          },
          {
            type: 'paragraph',
            text: 'Pellentesque et consequat arcu, ac laoreet ante. Nam non.',
            spans: [
              {
                start: 49,
                end: 56,
                type: 'strong',
              },
            ],
          },
        ],
        heading: 'Cras laoreet mi',
      },
    ],
  },
};

const mockedPost = {
  slug: mockedGetByUIDReturn.uid,
  title: mockedGetByUIDReturn.data.title,
  subTitle: mockedGetByUIDReturn.data.subtitle,
  author: mockedGetByUIDReturn.data.author,
  banner: mockedGetByUIDReturn.data.banner.url,
  updatedAt: dateTimeFormatter(
    new Date(mockedGetByUIDReturn.last_publication_date),
  ),
  publicatedAt: dateFormatter(
    new Date(mockedGetByUIDReturn.first_publication_date),
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: mockedGetByUIDReturn.data.content.map((group: any) => ({
    heading: group.heading,
    body: RichText.asHtml(group.body),
  })),
  timeReading: '4 min',
};

describe('<Post />', () => {
  beforeAll(() => {
    mockedUseRouter.mockReturnValue({ isFallback: false });

    mockedPrismic.mockReturnValue({
      getByType: () => {
        return Promise.resolve(mockedGetByTypeReturn);
      },

      getAllByType: () => {
        return Promise.resolve(mockedGetAllByTypeReturn);
      },

      getByUID: () => {
        return Promise.resolve(mockedGetByUIDReturn);
      },
    });
  });

  it('should be able to return prismic posts documents paths using getStaticPaths', async () => {
    const expectedPaths = [
      {
        params: {
          slug: 'como-utilizar-hooks',
        },
      },
      {
        params: {
          slug: 'criando-um-app-cra-do-zero',
        },
      },
    ];

    const getStaticPathsContext: GetStaticPathsContext = {};

    const response = (await getStaticPaths(
      getStaticPathsContext,
    )) as GetStaticPathsResult;

    expect(response.paths).toEqual(expectedPaths);
  });

  it('should be able to return prismic post document using getStaticProps', async () => {
    mockedPrismic.mockReturnValue({
      getByType: () => {
        return Promise.resolve({ results: [] });
      },

      getByUID: () => {
        return Promise.resolve(mockedGetByUIDReturn);
      },
    });

    const routeParam = parse('como-utilizar-hooks');

    const expectedPost = mockedGetByUIDReturn;

    const getStaticPropsContext: GetStaticPropsContext<ParsedUrlQuery> = {
      params: routeParam,
    };

    const { props } = (await getStaticProps(
      getStaticPropsContext,
    )) as GetStaticPropsResult;

    expect(props.post.slug).toEqual(expectedPost.uid);
    expect(props.post.author).toEqual(expectedPost.data.author);
    expect(props.post.title).toEqual(expectedPost.data.title);
    expect(props.post.subTitle).toEqual(expectedPost.data.subtitle);
    expect(props.post.banner).toEqual(expectedPost.data.banner.url);
  });

  it('should be able to render post document info', () => {
    render(<Post post={mockedPost} />);

    screen.getByText(/como utilizar Hooks/i);
    screen.getByText(/17 jun 2022/i);
    screen.getByText(/\* editado em 18 jun 2022, às 16:25/i);
    screen.getByText(/silvano marques/i);
    screen.getByText(/4 min/i);

    screen.getByText(/Proin et varius/i);
    screen.getByText(/Nullam dolor sapien/i);
    screen.getByText(/Cras laoreet mi/i);
    screen.getByText(/Ut varius quis velit sed cursus/i);
  });

  it('should be able to render loading message if fallback', () => {
    mockedUseRouter.mockReturnValueOnce({
      isFallback: true,
    });

    render(<Post post={mockedPost} />);

    screen.getByText('Carregando...');
  });
});
