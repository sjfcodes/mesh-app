import { AuthEventData } from '@aws-amplify/ui';
import { UserType } from '../../types';

export type SignOut = ((data?: AuthEventData | undefined) => void) | undefined;
export interface CurrentUserContext {
  user: UserType;
  signOut: ((data?: AuthEventData | undefined) => void) | undefined;
}
