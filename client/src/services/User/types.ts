import { AuthEventData } from '@aws-amplify/ui';
import { AmplifyUser } from '@aws-amplify/ui';

export type SignOut = ((data?: AuthEventData | undefined) => void) | undefined;
export interface CurrentUserContext {
  useUser: [AmplifyUser, React.Dispatch<AmplifyUser>];
  signOut: ((data?: AuthEventData | undefined) => void) | undefined;
}
