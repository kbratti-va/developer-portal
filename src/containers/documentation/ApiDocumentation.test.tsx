import { findByRole, fireEvent, getByText, render, screen } from '@testing-library/react';
import { MockedRequest, rest, restContext } from 'msw';
import { ResponseComposition, MockedResponse } from 'msw/lib/types/response';
import { setupServer } from 'msw/node';
import * as React from 'react';
import { Provider } from 'react-redux';
import * as openAPIData from '../../__mocks__/openAPIData/openAPIData.test.json';
import { APIDescription, ProdAccessFormSteps } from '../../apiDefs/schema';
import { AppFlags, FlagsProvider, getFlags } from '../../flags';
import store, { history } from '../../store';
import ApiDocumentation from './ApiDocumentation';

const ReleaseNotes: React.FunctionComponent = () => <div>My API&apos;s release notes</div>;
const api: APIDescription = {
  description: "it's a great API!",
  docSources: [
    {
      openApiUrl: 'https://example.com/my/openapi/spec',
    },
  ],
  enabledByDefault: true,
  lastProdAccessStep: ProdAccessFormSteps.Three,
  name: 'My API',
  openData: false,
  releaseNotes: ReleaseNotes.toString(),
  urlFragment: 'my_api',
  vaInternalOnly: false,
};

const server = setupServer(
  rest.get(
    'https://example.com/my/openapi/spec',
    (
      req: MockedRequest,
      res: ResponseComposition,
      context: typeof restContext,
    ): MockedResponse | Promise<MockedResponse> =>
      res(context.status(200), context.json(openAPIData)),
  ),
);

jest.mock('react-router-dom', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  ...(jest.requireActual('react-router-dom') as Record<string, unknown>),
  useHistory: jest.fn().mockReturnValue({
    location: { pathname: '/another-route' },
    push: jest.fn(),
  }),
  useLocation: jest.fn().mockReturnValue({
    hash: '',
    key: '5nvxpbdafa',
    pathname: '/another-route',
    search: '',
    state: null,
  }),
}));

describe('ApiDocumentation', () => {
  const defaultFlags: AppFlags = {
    ...getFlags(),
    hosted_apis: { my_api: true },
  };

  beforeAll(() => server.listen());
  beforeEach(() => {
    render(
      <Provider store={store}>
        <FlagsProvider flags={defaultFlags}>
          <ApiDocumentation apiDefinition={api} location={history.location} />
        </FlagsProvider>
      </Provider>,
    );
  });

  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('renders the OpenAPI URI', async () => {
    expect(await screen.findByText('https://example.com/my/openapi/spec')).toBeInTheDocument();
  });

  it('has a section for each tag', async () => {
    expect(await screen.findByRole('heading', { name: 'Places' })).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'People' })).toBeInTheDocument();
  });

  describe('operations', () => {
    const getOperationContainer = async (tag: string): Promise<HTMLElement> => {
      const tagEl: HTMLElement = await screen.findByRole('heading', { name: tag });
      expect(tagEl.tagName.toLowerCase()).toBe('h3');
      expect(tagEl.nextElementSibling).not.toBeNull();
      return tagEl.nextElementSibling as HTMLElement;
    };

    it('has a section for each operation', async () => {
      const assertOperationPresent = async (tag: string, path: RegExp): Promise<void> => {
        const containerEl: HTMLElement = await getOperationContainer(tag);
        const methodEl: HTMLElement = getByText(containerEl, 'GET');
        expect(methodEl).toBeInTheDocument();
        expect(methodEl.nextElementSibling).not.toBeNull();
        expect(methodEl.nextElementSibling).toHaveTextContent(path);
      };

      await assertOperationPresent('Places', /\/places.*\/\{id\}$/);
      await assertOperationPresent('People', /\/people.*\/\{id\}$/);
    });

    it('has parameters for each operation', async () => {
      const assertParametersPresent = async (tag: string, path: RegExp): Promise<void> => {
        const containerEl: HTMLElement = await getOperationContainer(tag);
        fireEvent.click(getByText(containerEl, path));
        expect(
          await findByRole(containerEl, 'heading', { name: 'Parameters' }),
        ).toBeInTheDocument();
      };

      await assertParametersPresent('Places', /\/places.*\/\{id\}$/);
      await assertParametersPresent('People', /\/people.*\/\{id\}$/);
    });

    it('has parameters for each operation', async () => {
      const assertResponsesPresent = async (tag: string, path: RegExp): Promise<void> => {
        const containerEl: HTMLElement = await getOperationContainer(tag);
        fireEvent.click(getByText(containerEl, path));
        expect(await findByRole(containerEl, 'heading', { name: 'Responses' })).toBeInTheDocument();
      };

      await assertResponsesPresent('Places', /\/places.*\/\{id\}$/);
      await assertResponsesPresent('People', /\/people.*\/\{id\}$/);
    });
  });
});
