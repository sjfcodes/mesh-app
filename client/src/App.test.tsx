import React from 'react';
import { render, screen } from '@testing-library/react';
import { AmplifyUser } from '@aws-amplify/ui';

import App from './App';

test('renders learn react link', () => {
  render(<App signOut={() => null} user={{} as AmplifyUser} />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
