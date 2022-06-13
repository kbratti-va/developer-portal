/* eslint-disable max-lines */
/**
 * Note the use of the secondary swagger api instead of the primary for openApiUrl. Health APIs do not have a
 * staging environment setup, as such we can only use `sandbox-api.va.gov` or `api.va.gov` for the openApiUrl host.
 * The primary swagger api is tied to the environment. The secondary swagger api always points to production.
 * Using the primary swagger api would break staging. The swagger url is shown in the UI. In order to avoid the
 * confusion of having a `sandbox-api.va.gov` url shown in production `api.va.gov` (the secondary swagger api) is
 * used in all developer portal environments for health documentation.
 */

import { OPEN_API_SPEC_HOST } from '../../types/constants';
import {
  ArgonautReleaseNotes,
  ClinicalHealthReleaseNotes,
  CommunityCareReleaseNotes,
  FhirApiReleaseNotes,
  FhirArgonautApiIntro,
  FhirDSTU2ApiIntro,
  FHIRMultiOpenAPIIntro,
  HealthArgonautDeactivationNotice,
  HealthArgonautDeprecationNotice,
  PgdReleaseNotes,
  UrgentCareApiIntro,
  UrgentCareDeactivationNotice,
  UrgentCareDeprecationNotice,
  UrgentCareReleaseNotes,
  ProviderDirectoryReleaseNotes,
} from '../../content/apiDocs/health';
import { APIDescription, ProdAccessFormSteps } from '../schema';

const swaggerHost: string = process.env.REACT_APP_VETSGOV_SECONDARY_SWAGGER_API ?? '';
const healthApis: APIDescription[] = [
  {
    // adding an altID to match keys need on the backend for signup
    altID: 'clinicalHealth',
    description:
      'Use to develop clinical-facing applications that improve access to and management of patient health data.',
    docSources: [
      {
        metadataUrl: `${OPEN_API_SPEC_HOST}/internal/docs/fhir-clinical-health/metadata.json`,
        openApiUrl: `${OPEN_API_SPEC_HOST}/internal/docs/fhir-clinical-health/v0/openapi.json`,
      },
    ],
    enabledByDefault: true,
    lastProdAccessStep: ProdAccessFormSteps.Three,
    name: 'Clinical Health API (FHIR)',
    oAuth: true,
    oAuthInfo: {
      acgInfo: {
        baseAuthPath: '/oauth2/clinical-health/v2',
        scopes: [
          'profile',
          'openid',
          'offline_access',
          'fhirUser',
          'launch',
          'patient/Condition.read',
          'patient/Observation.read',
          'patient/Patient.read',
          'patient/Practitioner.read',
        ],
      },
    },
    oAuthTypes: ['AuthorizationCodeGrant'],
    openData: false,
    releaseNotes: ClinicalHealthReleaseNotes.toString(),
    urlFragment: 'clinical_health',
    vaInternalOnly: true,
  },
  {
    altID: 'communityCare',
    description:
      "VA's Community Care Eligibility API utilizes VA's Facility API, VA's Enrollment & Eligibility system and others to satisfy requirements found in the VA's MISSION Act of 2018.",
    docSources: [
      {
        metadataUrl: `${OPEN_API_SPEC_HOST}/internal/docs/community-care-eligibility/metadata.json`,
        openApiUrl: `${OPEN_API_SPEC_HOST}/internal/docs/community-care-eligibility/v0/openapi.json`,
      },
    ],
    enabledByDefault: true,
    lastProdAccessStep: ProdAccessFormSteps.Four,
    name: 'Community Care Eligibility API',
    oAuth: true,
    oAuthInfo: {
      acgInfo: {
        baseAuthPath: '/oauth2/community-care/v1',
        scopes: [
          'profile',
          'openid',
          'offline_access',
          'launch/patient',
          'patient/CommunityCareEligibility.read',
        ],
      },
    },
    oAuthTypes: ['AuthorizationCodeGrant'],
    openData: false,
    releaseNotes: CommunityCareReleaseNotes.toString(),
    urlFragment: 'community_care',
    vaInternalOnly: false,
  },
  {
    altID: 'providerDirectory',
    description:
      'Use this API to return lists of VA providers and their information, such as locations, specialties, office hours, and more.',
    docSources: [
      {
        openApiUrl: `${OPEN_API_SPEC_HOST}/internal/docs/provider-directory-r4/v0/openapi.json`,
      },
    ],
    enabledByDefault: false,
    lastProdAccessStep: ProdAccessFormSteps.Four,
    name: 'Provider Directory API',
    openData: false,
    releaseNotes: ProviderDirectoryReleaseNotes.toString(),
    urlFragment: 'provider_directory',
    vaInternalOnly: false,
  },
  {
    deactivationInfo: {
      deactivationContent: UrgentCareDeactivationNotice.toString(),
      deactivationDate: '2020-07-20T00:00:00.000-04:00',
      deprecationContent: UrgentCareDeprecationNotice.toString(),
      deprecationDate: '2020-07-13T00:00:00.000-04:00',
    },
    description:
      "The VA's Health Urgent Care Eligibility API supports industry standards (e.g., Fast Healthcare Interoperability Resources [FHIR]) and provides access to a Veteran's urgent care eligibility status.",
    docSources: [
      {
        apiIntro: UrgentCareApiIntro.toString(),
        openApiUrl: `${swaggerHost}/services/fhir/v0/r4/openapi.json`,
      },
    ],
    enabledByDefault: true,
    lastProdAccessStep: ProdAccessFormSteps.Four, // doesn't matter, never had it, required by APIDescription
    name: 'Urgent Care Eligibility API (FHIR)',
    oAuth: true,
    openData: false,
    releaseNotes: UrgentCareReleaseNotes.toString(),
    urlFragment: 'urgent_care',
    vaInternalOnly: false,
  },
  {
    altID: 'pgd',
    description: '',
    docSources: [
      {
        // There is no docserver URL yes for PGD so no metadata.json file yes.
        openApiUrl: `${swaggerHost}/services/pgd/v0/r4/openapi.json`,
      },
    ],
    enabledByDefault: false,
    lastProdAccessStep: ProdAccessFormSteps.Four,
    name: 'PGD API (FHIR)',
    oAuth: true,
    oAuthInfo: {
      ccgInfo: {
        baseAuthPath: '/oauth2/pgd/system/v1',
        productionAud: 'aus8ew475sXlNGpbp297',
        sandboxAud: 'aus8x27nv4g4BS01v2p7',
        scopes: [
          'launch',
          'patient/Observation.read',
          'patient/Observation.write',
          'patient/Patient.read',
          'patient/Patient.write',
          'patient/Questionnaire.read',
          'patient/Questionnaire.write',
          'patient/QuestionnaireResponse.read',
          'patient/QuestionnaireResponse.write',
          'system/Questionnaire.read',
          'system/Questionnaire.write',
        ],
      },
    },
    oAuthTypes: ['ClientCredentialsGrant'],
    openData: false,
    releaseNotes: PgdReleaseNotes.toString(),
    urlFragment: 'pgd',
    vaInternalOnly: true,
  },
  {
    altID: 'health',
    description:
      'Use the OpenID Connect and SMART on FHIR standards to allow Veterans to authorize third-party applications to access data on their behalf.',
    docSources: [
      {
        key: 'r4',
        label: 'R4',
        metadataUrl: `${OPEN_API_SPEC_HOST}/internal/docs/fhir-r4/metadata.json`,
        openApiUrl: `${OPEN_API_SPEC_HOST}/internal/docs/fhir-r4/v0/openapi.json`,
      },
      {
        apiIntro: FhirArgonautApiIntro.toString(),
        key: 'argonaut',
        label: 'Argonaut',
        metadataUrl: `${OPEN_API_SPEC_HOST}/internal/docs/fhir-argonaut/metadata.json`,
        openApiUrl: `${OPEN_API_SPEC_HOST}/internal/docs/fhir-argonaut/v0/openapi.json`,
      },
      {
        apiIntro: FhirDSTU2ApiIntro.toString(),
        key: 'dstu2',
        label: 'DSTU2',
        metadataUrl: `${OPEN_API_SPEC_HOST}/internal/docs/fhir-dstu2/metadata.json`,
        openApiUrl: `${OPEN_API_SPEC_HOST}/internal/docs/fhir-dstu2/v0/openapi.json`,
      },
    ],
    enabledByDefault: true,
    lastProdAccessStep: ProdAccessFormSteps.Four,
    multiOpenAPIIntro: FHIRMultiOpenAPIIntro.toString(),
    name: 'Veterans Health API (FHIR)',
    oAuth: true,
    oAuthInfo: {
      acgInfo: {
        baseAuthPath: '/oauth2/health/v1',
        scopes: [
          'profile',
          'openid',
          'offline_access',
          'launch/patient',
          'patient/AllergyIntolerance.read',
          'patient/Appointment.read',
          'patient/Condition.read',
          'patient/Device.read',
          'patient/DeviceRequest.read',
          'patient/DiagnosticReport.read',
          'patient/Encounter.read',
          'patient/Immunization.read',
          'patient/Location.read',
          'patient/Medication.read',
          'patient/MedicationOrder.read',
          'patient/MedicationRequest.read',
          'patient/MedicationStatement.read',
          'patient/Observation.read',
          'patient/Organization.read',
          'patient/Patient.read',
          'patient/Practitioner.read',
          'patient/PractitionerRole.read',
          'patient/Procedure.read',
        ],
      },
      ccgInfo: {
        baseAuthPath: '/oauth2/health/system/v1',
        productionAud: 'aus8evxtl123l7Td3297',
        sandboxAud: 'aus8nm1q0f7VQ0a482p7',
        scopes: [
          'launch',
          'system/AllergyIntolerance.read',
          'system/Appointment.read',
          'system/Condition.read',
          'system/Coverage.read',
          'system/Coverage.write',
          'system/DiagnosticReport.read',
          'system/Immunization.read',
          'system/Location.read',
          'system/Medication.read',
          'system/MedicationOrder.read',
          'system/Observation.read',
          'system/Organization.read',
          'system/Patient.read',
        ],
      },
    },
    oAuthTypes: ['AuthorizationCodeGrant', 'ClientCredentialsGrant'],
    openData: false,
    releaseNotes: FhirApiReleaseNotes.toString(),
    urlFragment: 'fhir',
    vaInternalOnly: false,
  },
  {
    altID: 'health',
    description:
      'Use the OpenID Connect and SMART on FHIR standards to allow Veterans to authorize third-party applications to access data on their behalf.',
    docSources: [
      {
        metadataUrl: `${OPEN_API_SPEC_HOST}/internal/docs/fhir/metadata.json`,
        openApiUrl: `${OPEN_API_SPEC_HOST}/internal/docs/fhir-r4/v0/openapi.json`,
      },
    ],
    enabledByDefault: false,
    lastProdAccessStep: ProdAccessFormSteps.Four,
    name: 'Patient Health API (FHIR)',
    oAuth: true,
    oAuthInfo: {
      acgInfo: {
        baseAuthPath: '/oauth2/health/v1',
        scopes: [
          'profile',
          'openid',
          'offline_access',
          'launch/patient',
          'patient/AllergyIntolerance.read',
          'patient/Appointment.read',
          'patient/Condition.read',
          'patient/Device.read',
          'patient/DeviceRequest.read',
          'patient/DiagnosticReport.read',
          'patient/Encounter.read',
          'patient/Immunization.read',
          'patient/Location.read',
          'patient/Medication.read',
          'patient/MedicationOrder.read',
          'patient/MedicationRequest.read',
          'patient/MedicationStatement.read',
          'patient/Observation.read',
          'patient/Organization.read',
          'patient/Patient.read',
          'patient/Practitioner.read',
          'patient/PractitionerRole.read',
          'patient/Procedure.read',
        ],
      },
      ccgInfo: {
        baseAuthPath: '/oauth2/health/system/v1',
        productionAud: 'aus8evxtl123l7Td3297',
        sandboxAud: 'aus8nm1q0f7VQ0a482p7',
        scopes: [
          'launch',
          'system/AllergyIntolerance.read',
          'system/Appointment.read',
          'system/Condition.read',
          'system/Coverage.read',
          'system/Coverage.write',
          'system/DiagnosticReport.read',
          'system/Immunization.read',
          'system/Location.read',
          'system/Medication.read',
          'system/MedicationOrder.read',
          'system/Observation.read',
          'system/Organization.read',
          'system/Patient.read',
        ],
      },
    },
    oAuthTypes: ['AuthorizationCodeGrant', 'ClientCredentialsGrant'],
    openData: false,
    releaseNotes: FhirApiReleaseNotes.toString(),
    urlFragment: 'patient_health',
    vaInternalOnly: false,
    versionSelectorLabel: 'Select a FHIR specification',
  },
  {
    deactivationInfo: {
      deactivationContent: HealthArgonautDeactivationNotice.toString(),
      // see the RFC 2822 date format section here: https://momentjs.com/docs/#/parsing/string-format/
      deactivationDate: '01 Oct 2019 00:00 EDT',
      deprecationContent: HealthArgonautDeprecationNotice.toString(),
      deprecationDate: '15 Sep 2019 00:00 EDT',
    },
    description:
      'Both the legacy API endpoints and this legacy documentation will no longer be accessible beginning Oct 1, 2019.',
    docSources: [
      {
        openApiUrl: `${swaggerHost}/services/argonaut/v0/openapi.json`,
      },
    ],
    enabledByDefault: true,
    lastProdAccessStep: ProdAccessFormSteps.Four, // doesn't matter, never had it, required by APIDescription
    name: 'Veterans Health API (Legacy)',
    oAuth: true,
    openData: false,
    releaseNotes: ArgonautReleaseNotes.toString(),
    urlFragment: 'argonaut',
    vaInternalOnly: false,
  },
];

export default healthApis;
