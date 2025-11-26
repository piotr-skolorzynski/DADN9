import { IRegisterProfile } from './register-profile.interface';

export interface IRegisterCredentials extends IRegisterProfile {
  email: string;
  displayName: string;
  password: string;
}
