import * as React from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { CONSUMER_SANDBOX_PATH } from '../../../types/constants/paths';
import { SectionHeaderWrapper } from '../../index';

const GettingStarted = (): JSX.Element => (
  <>
    <SectionHeaderWrapper heading="Getting Started" id="getting-started" />
    <p>
      The VA Lighthouse APIs platform uses the{' '}
      <a href="https://openid.net/specs/openid-connect-core-1_0.html">OpenID Connect</a> standard to
      allow Veterans to authorize third-party applications or Veteran Service Organizations (VSOs)
      to access data on their behalf. The kind of access granted, process for authorization, and
      third party being authorized depends on the API.
    </p>
    <p>
      The first step toward authorization is to{' '}
      <Link to={CONSUMER_SANDBOX_PATH}>fill out our application</Link> and make sure to select the
      right OAuth API for your needs. To complete the form, you will need:
    </p>
    <ul>
      <li>Your organization name</li>
      <li>To know which OAuth APIs you want to access</li>
      <li>To know whether your app can securely hide a client secret</li>
      <li>Your OAuth redirect URI</li>
    </ul>
    <p>
      After you submit the form, we send you a client ID and secret, depending on whether you can
      safely store a client secret. If you cannot safely store a client secret, we will send you a
      client ID and you will use the{' '}
      <HashLink to={{ ...location, hash: '#pkce-authorization' }}>
        Proof Key for Code Exchange
      </HashLink>{' '}
      (PKCE) flow (<a href="https://tools.ietf.org/html/rfc7636">RFC 7636</a>) for authorization.{' '}
    </p>
    <h3>Support</h3>
    <p>
      If you have any questions please feel free to reach out to the VA API Platform team at{' '}
      <a href="mailto:api@va.gov">api@va.gov</a>. If you would like to report a bug or make a
      feature request, please open an issue through our <Link to="/support">Support page</Link>.
    </p>
  </>
);

GettingStarted.propTypes = {};

export { GettingStarted };
