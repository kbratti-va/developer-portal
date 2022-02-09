import { APIDescription } from '../apiDefs/schema';

export * from './forms/apply';

export interface APINameParam {
  apiName?: string;
  apiCategoryKey: string;
}

export interface VersionMetadata {
  version: string;
  path: string;
  status: string;
  internal_only: boolean;
  healthcheck: string;
}

export interface APIMetadata {
  meta: {
    versions: VersionMetadata[];
  };
}

export interface APIVersioning {
  defaultUrl: string;
  versions: VersionMetadata[] | null;
  requestedApiVersion: string;
}

export interface OAuthAPISelection {
  selectedOAuthApi: string;
}

export interface ApiList {
  apis: APIDescription[];
}

export interface RootState {
  oAuthApiSelection: OAuthAPISelection;
  apiVersioning: APIVersioning;
  apiList: ApiList;
}
