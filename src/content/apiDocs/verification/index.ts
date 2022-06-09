import { APICategoryContent } from '../../../apiDefs/schema';
import AddressValidationReleaseNotes from './addressValidationReleaseNotes.mdx';
import VerificationOverview from './verificationOverview.mdx';
import VeteranConfirmationReleaseNotes from './veteranConfirmationReleaseNotes.mdx';
import VeteranVerificationReleaseNotes from './veteranVerificationReleaseNotes.mdx';
import VaLetterGeneratorReleaseNotes from './vaLetterGeneratorReleaseNotes.mdx';

const verificationContent: APICategoryContent = {
  consumerDocsLinkText: 'Read the consumer onboarding guide for getting production access',
  overview: VerificationOverview.toString(),
  shortDescription: 'Empowering Veterans to take control of their data and put it to work.',
};

export {
  verificationContent,
  AddressValidationReleaseNotes,
  VeteranConfirmationReleaseNotes,
  VeteranVerificationReleaseNotes,
  VaLetterGeneratorReleaseNotes,
};
