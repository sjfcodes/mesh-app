import { Image } from '@aws-amplify/ui-react';
import { Text } from '@aws-amplify/ui-react';
import { useTheme } from '@aws-amplify/ui-react';
import { Authenticator } from '@aws-amplify/ui-react';
import { View } from '@aws-amplify/ui-react';
import { UserProvider } from '../services/User/Provider';

// https://ui.docs.amplify.aws/react/connected-components/authenticator/customization

const components = {
  Header() {
    const { tokens } = useTheme();

    return (
      <View textAlign="center" padding={tokens.space.large}>
        <Image
          alt="Amplify logo"
          src="https://docs.amplify.aws/assets/logo-dark.svg"
        />
      </View>
    );
  },
  Footer() {
    const { tokens } = useTheme();

    return (
      <View textAlign="center" padding={tokens.space.large}>
        <Text color={tokens.colors.neutral[80]}>
          &copy; all rights reserved
        </Text>
      </View>
    );
  },
};

// https://ui.docs.amplify.aws/react/connected-components/authenticator/customization

const CustomAuthenticator = ({ children }: any) => {
  return (
    <Authenticator components={components} loginMechanisms={['email']}>
      {({ signOut, user }) => (
        <UserProvider user={user} signOut={signOut}>
          {children}
        </UserProvider>
      )}
    </Authenticator>
  );
};

export default CustomAuthenticator;
