import { IRegisterCredentials } from './register-credentials.interface';

export interface ICombinedCredentialForms extends IRegisterCredentials {
  confirmPassword?: string;
}
