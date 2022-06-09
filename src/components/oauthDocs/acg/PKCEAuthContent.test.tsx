import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { FlagsProvider, getFlags } from '../../../flags';

import { getActiveOauthApis, lookupApiByFragment } from '../../../apiDefs/query';
import store from '../../../store';
import { isApiDeactivated } from '../../../apiDefs/deprecated';
import { APIDescription } from '../../../apiDefs/schema';
import apiDefs from '../../../apiDefs/data/categories';
import { setApis } from '../../../actions';
import { PKCEAuthContent } from './PKCEAuthContent';

describe('Auth Flow Content', () => {
  store.dispatch(setApis(apiDefs));

  beforeEach(() => {
    const selectedOption = 'veteran_verification';
    const apiDef = lookupApiByFragment(selectedOption);
    const defs = getActiveOauthApis();

    render(
      <Provider store={store}>
        <FlagsProvider flags={getFlags()}>
          <MemoryRouter>
            <PKCEAuthContent apiDef={apiDef} options={defs} selectedOption={selectedOption} />
          </MemoryRouter>
        </FlagsProvider>
      </Provider>,
    );
  });
  it('PKCE Auth Header', () => {
    const heading = screen.getByText('PKCE (Proof Key for Code Exchange) Authorization');
    expect(heading).toBeInTheDocument();
  });
  it('Oauth base path found ', () => {
    const codeWrapperArray = screen.getAllByText(
      /\/oauth2\/veteran\-verification\/v1\/authorization\? /i,
    );
    expect(codeWrapperArray.length).toBeGreaterThan(0);
  });
  it('Corrent number of code wrappers', () => {
    const codeWrapperArray = document.getElementsByClassName('code-wrapper');
    expect(codeWrapperArray.length).toBeGreaterThanOrEqual(6);
  });
});
