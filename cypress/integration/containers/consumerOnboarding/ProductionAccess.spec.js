/// <reference types="cypress" />

function verificationFields(cy) {
  cy.get('#isUSBasedCompanyFormFieldyes').click();
  cy.get('#is508CompliantFormFieldyes').click();
  cy.get('#termsOfServiceFormField').click();
}

function basicInformationFields(cy) {
  cy.get('#primaryContactfirstNameFormField').type('PrimaryFirstName');
  cy.get('#primaryContactlastNameFormField').type('PrimaryLastName');
  cy.get('#primaryContactemailFormField').type('PrimaryEmailAddress@va.gov');
  cy.get('#secondaryContactfirstNameFormField').type('SecondaryFirstName');
  cy.get('#secondaryContactlastNameFormField').type('SecondaryLastName');
  cy.get('#secondaryContactemailFormField').type('SecondaryEmailAddress@va.gov');
  cy.get('#organizationFormField').type('CompanyName');
  cy.get('#phoneNumberFormField').type('8005551212');
  cy.get('#appNameFormField').type('AppName');
  cy.get('#statusUpdateEmails\\.0').type('NotificationEmailAddress@va.gov');
  cy.get('#valueProvidedFormField').type('This is a testing description for an app.');
  cy.get('#monitizedVeteranInformationFormFieldyes').click();
  cy.get('#monitizationExplanationFormField').type('This is an explaination for monetization.');
  cy.get('#veteranFacingFormFieldyes').click();
  cy.get('#websiteFormField').type('https://developer.va.gov');
  cy.get('#signUpLinkFormField').type('https://developer.va.gov');
  cy.get('#supportLinkFormField').type('https://developer.va.gov');
  cy.get('#platformsFormField').type('platformsFormField');
  cy.get('#appDescriptionFormField').type('appDescriptionFormField');
}

function technicalInformationFields(cy) {
  cy.get('#productionOrOAuthKeyCredentialStorageFormField').type(
    'productionOrOAuthKeyCredentialStorageFormField',
  );
  cy.get('#storePIIOrPHIFormFieldyes').click();
  cy.get('#piiStorageMethodFormField').type('piiStorageMethodFormField');
  cy.get('#multipleReqSafeguardsFormField').type('multipleReqSafeguardsFormField');
  cy.get('#breachManagementProcessFormField').type('breachManagementProcessFormField');
  cy.get('#vulnerabilityManagementFormField').type('vulnerabilityManagementFormField');
  cy.get('#exposeVeteranInformationToThirdPartiesFormFieldyes').click();
  cy.get('#thirdPartyInfoDescriptionFormField').type('thirdPartyInfoDescriptionFormField');
  cy.get('#scopesAccessRequestedFormField').type('scopesAccessRequestedFormField');
}

describe('Production Access Form', () => {
  beforeEach(() => {
    cy.visit('/onboarding/request-prod-access');
    cy.get('a[href="/onboarding/production-access-application"]').click();
  });

  it('Test US-based companies only modal', () => {
    cy.get('#isUSBasedCompanyFormFieldno').click();
    cy.get('#is508CompliantFormFieldyes').click();
    cy.get('#apisFormFieldappeals').click();
    cy.get('#termsOfServiceFormField').click();
    cy.get('button.usa-button[type=submit]').click();
    cy.get('#non-us-based-modal-title').should('be.visible');

    cy.get('.va-modal-close').click();
    cy.get('#non-us-based-modal-title').should('not.exist');

    cy.get('button.usa-button[type=submit]').click();
    cy.get('#non-us-based-modal-title').should('be.visible');

    cy.get('#non-us-based-modal .usa-button').click();
    cy.get('.vads-c-action-link--green').should('be.visible');
  });

  it('Form cancellation modal works', () => {
    cy.get('#main .va-api-button-default').click();
    cy.get('#cancellation-modal').should('be.be.visible');

    cy.get('#cancellation-modal .usa-button-secondary').click();
    cy.get('#cancellation-modal').should('not.exist');

    cy.get('#main .va-api-button-default').click();
    cy.get('#cancellation-modal').should('be.be.visible');

    cy.get('#cancellation-modal .usa-button').click();
    cy.get('.vads-c-action-link--green').should('be.visible');
  });

  it('Form validation works on step 1', () => {
    cy.get('.usa-input-error').should('have.length', '0');
    cy.get('#main button[type="submit"]').click();
    cy.get('.usa-input-error').should('have.length', '4');
    cy.get('#isUSBasedCompanyFormFieldyes').click();
    cy.get('#is508CompliantFormFieldyes').click();
    cy.get('#termsOfServiceFormField').click();
    cy.get('#main button[type="submit"]').click();
    cy.get('.usa-input-error').should('have.length', '1');
    cy.get('#apisFormFieldappeals').click();
    cy.get('#main button[type="submit"]').click();
    cy.get('.usa-input-error').should('have.length', '0');
  });

  it('Form works for 2 step flow (VA Facilities)', () => {
    cy.intercept('POST', '/platform-backend/v0/consumers/production-requests', {
      statusCode: 201,
      body: {
        ok: true,
        status: 201,
      },
    });

    verificationFields(cy);
    cy.get('#apisFormFieldfacilities').click();
    cy.get('#main button[type="submit"]').click();

    cy.focused()
      .should('have.id', 'form-step-heading')
      .should('have.text', 'Step 2 of 2: Basic information');
    basicInformationFields(cy);
    cy.get('#productionKeyCredentialStorageFormField').type(
      'This is an explaination on how we intend to decure production keys.',
    );
    cy.get('#main button[type="submit"]').click();

    cy.get('#submission-complete-modal').should('be.visible');
    cy.get('#submission-complete-modal .usa-button').click();
    cy.get('#submission-complete-modal').should('not.exist');
    cy.get('.vads-c-action-link--green').should('be.visible');
  });

  it('Form works for 3 step flow (Clinical Health)', () => {
    cy.intercept('POST', '/platform-backend/v0/consumers/production-requests', {
      statusCode: 201,
      body: {
        ok: true,
        status: 201,
      },
    });

    verificationFields(cy);
    cy.get('#apisFormFieldclinicalHealth').click();
    cy.get('#main button[type="submit"]').click();

    cy.focused()
      .should('have.id', 'form-step-heading')
      .should('have.text', 'Step 2 of 3: Basic information');
    basicInformationFields(cy);
    cy.get('#businessModelFormField').type('businessModelFormField');
    cy.get('#vasiSystemNameFormField').type('vasiSystemNameFormField');
    cy.get('#main button[type="submit"]').click();

    cy.focused()
      .should('have.id', 'form-step-heading')
      .should('have.text', 'Step 3 of 3: Technical information');
    technicalInformationFields(cy);
    cy.get('#main button[type="submit"]').click();

    cy.get('#submission-complete-modal').should('be.visible');
    cy.get('#submission-complete-modal .usa-button').click();
    cy.get('#submission-complete-modal').should('not.exist');
    cy.get('.vads-c-action-link--green').should('be.visible');
  });

  it('Form works for 4 step flow (Benefits Claims)', () => {
    cy.intercept('POST', '/platform-backend/v0/consumers/production-requests', {
      statusCode: 201,
      body: {
        ok: true,
        status: 201,
      },
    });

    verificationFields(cy);
    cy.get('#apisFormFieldclaims').click();
    cy.get('#main button[type="submit"]').click();

    cy.focused()
      .should('have.id', 'form-step-heading')
      .should('have.text', 'Step 2 of 4: Basic information');
    basicInformationFields(cy);
    cy.get('#businessModelFormField').type('businessModelFormField');
    cy.get('#main button[type="submit"]').click();

    cy.focused()
      .should('have.id', 'form-step-heading')
      .should('have.text', 'Step 3 of 4: Technical information');
    technicalInformationFields(cy);
    cy.get('#main button[type="submit"]').click();

    cy.focused()
      .should('have.id', 'form-step-heading')
      .should('have.text', 'Step 4 of 4: Policy governance');
    cy.get('#termsOfServiceURLFormField').type('https://developer.va.gov');
    cy.get('#privacyPolicyURLFormField').type('https://developer.va.gov');
    cy.get('#main button[type="submit"]').click();

    cy.get('#submission-complete-modal').should('be.visible');
    cy.get('#submission-complete-modal .usa-button').click();
    cy.get('#submission-complete-modal').should('not.exist');
    cy.get('.vads-c-action-link--green').should('be.visible');
  });
});
