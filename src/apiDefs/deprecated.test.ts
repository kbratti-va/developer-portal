import 'jest';
import moment from 'moment';

// we just need a Markdown component for  our test IApiDescription
import { UrgentCareDeprecationNotice } from '../content/apiDocs/health';
import { isApiDeactivated, isApiDeprecated } from './deprecated';
import { APIDescription, ProdAccessFormSteps } from './schema';

describe('deprecated API module', () => {
  const apiValues: APIDescription = {
    description: "it's a fabulous API, you really must try it sometime",
    docSources: [],
    enabledByDefault: true,
    lastProdAccessStep: ProdAccessFormSteps.Three,
    name: 'My API',
    oAuth: false,
    openData: false,
    releaseNotes: UrgentCareDeprecationNotice.toString(),
    urlFragment: 'my_api',
    vaInternalOnly: false,
  };
  let oldEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    oldEnv = process.env;
    process.env = {
      ...oldEnv,
    };
  });

  afterEach(() => {
    process.env = oldEnv;
  });

  describe('isApiDeprecated', () => {
    it('returns false if deactivationInfo is undefined', () => {
      expect(isApiDeprecated(apiValues)).toBe(false);
    });

    it('returns true if the FF is set', () => {
      process.env = {
        ...oldEnv,
        REACT_APP_MY_API_DEPRECATED: 'true',
      };
      const api: APIDescription = {
        ...apiValues,
        deactivationInfo: {
          deactivationContent: UrgentCareDeprecationNotice.toString(),
          deactivationDate: moment().add(2, 'month')
                                    .format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
          deprecationContent: UrgentCareDeprecationNotice.toString(),
          deprecationDate: moment().add(1, 'month')
                                   .format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        },
      };

      expect(isApiDeprecated(api)).toBe(true);
    });

    it('returns false if the deprecation date is in the future', () => {
      const api: APIDescription = {
        ...apiValues,
        deactivationInfo: {
          deactivationContent: UrgentCareDeprecationNotice.toString(),
          deactivationDate: moment().add(2, 'month')
                                    .format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
          deprecationContent: UrgentCareDeprecationNotice.toString(),
          deprecationDate: moment().add(1, 'month')
                                   .format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        },
      };
      expect(isApiDeprecated(api)).toBe(false);
    });

    it('returns true if the deprecation date is in the past', () => {
      const api: APIDescription = {
        ...apiValues,
        deactivationInfo: {
          deactivationContent: UrgentCareDeprecationNotice.toString(),
          deactivationDate: moment().add(2, 'month')
                                    .format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
          deprecationContent: UrgentCareDeprecationNotice.toString(),
          deprecationDate: moment().subtract(1, 'month')
                                   .format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        },
      };
      expect(isApiDeprecated(api)).toBe(true);
    });

    it('returns true if the API is deactivated', () => {
      const api: APIDescription = {
        ...apiValues,
        deactivationInfo: {
          deactivationContent: UrgentCareDeprecationNotice.toString(),
          deactivationDate: moment().subtract(1, 'month')
                                    .format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
          deprecationContent: UrgentCareDeprecationNotice.toString(),
          deprecationDate: moment().subtract(2, 'month')
                                   .format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        },
      };
      expect(isApiDeprecated(api)).toBe(true);
    });
  });

  describe('isApiDeactivated', () => {
    it('returns false if deactivationInfo is undefined', () => {
      expect(isApiDeactivated(apiValues)).toBe(false);
    });

    it('returns true if the FF is set', () => {
      process.env = {
        ...oldEnv,
        REACT_APP_MY_API_DEACTIVATED: 'true',
      };
      const api: APIDescription = {
        ...apiValues,
        deactivationInfo: {
          deactivationContent: UrgentCareDeprecationNotice.toString(),
          deactivationDate: moment().add(2, 'month')
                                    .format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
          deprecationContent: UrgentCareDeprecationNotice.toString(),
          deprecationDate: moment().add(1, 'month')
                                   .format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        },
      };

      expect(isApiDeactivated(api)).toBe(true);
    });

    it('returns false if the API is not deprecated yet', () => {
      const api: APIDescription = {
        ...apiValues,
        deactivationInfo: {
          deactivationContent: UrgentCareDeprecationNotice.toString(),
          deactivationDate: moment().add(2, 'month')
                                    .format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
          deprecationContent: UrgentCareDeprecationNotice.toString(),
          deprecationDate: moment().add(1, 'month')
                                   .format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        },
      };
      expect(isApiDeactivated(api)).toBe(false);
    });

    it('returns false if the API is deprecated but the deactivation date is in the future', () => {
      const api: APIDescription = {
        ...apiValues,
        deactivationInfo: {
          deactivationContent: UrgentCareDeprecationNotice.toString(),
          deactivationDate: moment().add(2, 'month')
                                    .format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
          deprecationContent: UrgentCareDeprecationNotice.toString(),
          deprecationDate: moment().subtract(1, 'month')
                                   .format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        },
      };
      expect(isApiDeactivated(api)).toBe(false);
    });

    it('returns true if the removal date is in the past', () => {
      const api: APIDescription = {
        ...apiValues,
        deactivationInfo: {
          deactivationContent: UrgentCareDeprecationNotice.toString(),
          deactivationDate: moment().subtract(1, 'month')
                                    .format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
          deprecationContent: UrgentCareDeprecationNotice.toString(),
          deprecationDate: moment().subtract(2, 'month')
                                   .format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        },
      };
      expect(isApiDeactivated(api)).toBe(true);
    });
  });
});
