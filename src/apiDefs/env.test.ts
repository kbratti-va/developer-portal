import 'jest';
import { ClaimsReleaseNotes } from '../content/apiDocs/benefits';
import { getEnvFlags, isHostedApiEnabled } from './env';
import * as queries from './query';
import { APIDescription, ProdAccessFormSteps } from './schema';

describe('env module', () => {
  const DEFAULT_ENV = process.env;
  let getAllApisSpy: jest.SpyInstance<Partial<APIDescription[]>>;

  beforeEach(() => {
    getAllApisSpy = jest.spyOn(queries, 'getAllApis');
    process.env = { ...DEFAULT_ENV };
  });

  describe('isHostedApiEnabled', () => {
    it("returns the env variable's value if it is explicitly set", () => {
      process.env.REACT_APP_FAKE_API_ENABLED = 'false';
      expect(isHostedApiEnabled('fake', true)).toBe(false);

      process.env.REACT_APP_FAKE_API_ENABLED = 'true';
      expect(isHostedApiEnabled('fake', false)).toBe(true);
    });

    it('returns the default value if the env variable is not set', () => {
      expect(isHostedApiEnabled('fake', true)).toBe(true);
      expect(isHostedApiEnabled('fake', false)).toBe(false);
    });

    it('returns false if the env variable is set but not a valid boolean value', () => {
      process.env.REACT_APP_FAKE_API_ENABLED = 'this is not a boolean';
      expect(isHostedApiEnabled('fake', true)).toBe(false);
    });
  });

  describe('getApiEnvFlags', () => {
    const enableApiId = 'real_api';
    const disabledApiId = 'fake_api';
    const sharedApiValues = {
      description: "it's a fabulous API, you really must try it sometime",
      docSources: [],
      lastProdAccessStep: ProdAccessFormSteps.Four,
      name: 'My API',
      openData: false,
      releaseNotes: ClaimsReleaseNotes.toString(),
      vaInternalOnly: false,
    };

    beforeEach(() => {
      getAllApisSpy.mockReturnValue([
        {
          ...sharedApiValues,
          enabledByDefault: true,
          urlFragment: enableApiId,
        },
        {
          ...sharedApiValues,
          enabledByDefault: false,
          urlFragment: disabledApiId,
        },
      ]);
    });

    it('sets each flag to the result of isHostedApiEnabled', () => {
      const envFlags = getEnvFlags();
      expect(envFlags[enableApiId]).toBe(true);
      expect(envFlags[disabledApiId]).toBe(false);
    });
  });
});
