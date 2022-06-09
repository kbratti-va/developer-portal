import AlertBox from '@department-of-veterans-affairs/component-library/AlertBox';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { useLocation, useParams } from 'react-router-dom';
import classNames from 'classnames';
import ReactMarkdown from 'react-markdown';
import { isApiDeactivated, isApiDeprecated } from '../../apiDefs/deprecated';

import { lookupApiByFragment, lookupApiCategory } from '../../apiDefs/query';
import { APIDescription } from '../../apiDefs/schema';
import { PageHeader } from '../../components';
import { useFlag } from '../../flags';

import { APINameParam } from '../../types';
import { FLAG_API_ENABLED_PROPERTY } from '../../types/constants';
import ApiDocumentation from './ApiDocumentation';
import ApiNotFoundPage from './ApiNotFoundPage';

const DeactivationMessage = ({ api }: { api: APIDescription }): JSX.Element | null => {
  /*
   * This code should be unneeded but is required for the linter. Without this
   * code DeactivationMessage will still return null (isApiDeprecated and
   * isApiDeactivated will both return false when api.deactivationInfo is
   * undefined, resulting in a null return on DeactivationMessage).
   * The linter does not catch this and thinks that api.deactivationInfo could
   * be undefined further down, even though the DeactionMessage would return
   * null before hitting that code.
   */
  if (!api.deactivationInfo) {
    return null;
  }

  const isDeprecated = isApiDeprecated(api);
  const isDeactivated = isApiDeactivated(api);

  if (!isDeprecated && !isDeactivated) {
    return null;
  }

  const { deactivationContent, deprecationContent } = api.deactivationInfo;
  const content = isDeactivated ? deactivationContent : deprecationContent;

  return (
    <div className={classNames('usa-alert', 'usa-alert-info', 'va-api-alert-box')}>
      <div className={classNames('usa-alert-body')}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};

const getApi = (apiName?: string): APIDescription | null => {
  if (!apiName) {
    return null;
  }

  return lookupApiByFragment(apiName);
};

const ApiPage = (): JSX.Element => {
  const location = useLocation();
  const params = useParams<APINameParam>();
  const enabledApisFlags = useFlag([FLAG_API_ENABLED_PROPERTY]);

  const api = getApi(params.apiName);
  const category = lookupApiCategory(params.apiCategoryKey);

  if (api === null || !category?.apis.includes(api) || !enabledApisFlags[api.urlFragment]) {
    return <ApiNotFoundPage />;
  }

  return (
    <>
      <Helmet>
        <title>{api.name} Documentation</title>
      </Helmet>
      <PageHeader halo={category.name} header={api.name} />
      {api.veteranRedirect && (
        <AlertBox
          status="info"
          key={api.urlFragment}
          className={classNames('vads-u-margin-bottom--2', 'vads-u-padding-y--1')}
        >
          {api.veteranRedirect.message}&nbsp;
          <a href={api.veteranRedirect.linkUrl}>{api.veteranRedirect.linkText}</a>.
        </AlertBox>
      )}
      <DeactivationMessage api={api} />
      {!isApiDeactivated(api) && <ApiDocumentation apiDefinition={api} location={location} />}
    </>
  );
};

ApiPage.propTypes = {};
export default ApiPage;
