import React, { useEffect } from 'react';
import {
  usePlaidLink,
  PlaidLinkOnSuccessMetadata,
  PlaidLinkOnExitMetadata,
  PlaidLinkError,
  PlaidLinkOptionsWithLinkToken,
  PlaidLinkOnEventMetadata,
  PlaidLinkStableEvent,
} from 'react-plaid-link';
import { useNavigate } from 'react-router-dom';

import { logEvent, logSuccess, logExit } from '../util/helpers'; // functions to log and save errors and metadata from Link events.
import useErrors from '../hooks/useErrors';
import useLink from '../hooks/useLink';
import { exchangeTokenCreateItem } from '../util/api';

interface Props {
  isOauth?: boolean;
  token: string;
  userId: string;
  itemId?: string | null;
  children?: React.ReactNode;
}

// Uses the useLink hook to manage the Plaid Link creation.  See https://github.com/plaid/react-plaid-link for full usage instructions.
// The link token passed to useLink cannot be null.  It must be generated outside of this component.  In this sample app, the link token
// is generated in the link context in client/src/services/link.js.

export default function LaunchLink(props: Props) {
  const { generateLinkToken, deleteLinkToken } = useLink();
  const { setError, resetError } = useErrors();
  const navigate = useNavigate();

  // define onSuccess, onExit and onEvent functions as configs for Plaid Link creation
  const onSuccess = async (
    publicToken: string,
    metadata: PlaidLinkOnSuccessMetadata
  ) => {
    // log and save metatdata
    logSuccess(metadata);
    if (props.itemId != null) {
      // update mode: no need to exchange public token
      // await setItemState(props.itemId, 'good');
      deleteLinkToken(null, props.itemId);
      // regular link mode: exchange public token for access token
    } else {
      // call to Plaid api endpoint: /item/public_token/exchange in order to obtain access_token which is then stored with the created item
      await exchangeTokenCreateItem(
        publicToken,
        metadata.institution,
        metadata.accounts,
        props.userId
      );
    }
    resetError();
    deleteLinkToken(props.userId, null);
    navigate(`/user/${props.userId}`);
  };

  const onExit = async (
    error: PlaidLinkError | null,
    metadata: PlaidLinkOnExitMetadata
  ) => {
    // log and save error and metatdata
    logExit(error, metadata);
    if (error != null && error.error_code === 'INVALID_LINK_TOKEN') {
      await generateLinkToken(props.userId, props.itemId || null);
    }
    if (error != null) {
      setError(error.error_code, error.display_message || error.error_message);
    }
    // to handle other error codes, see https://plaid.com/docs/errors/
  };

  const onEvent = async (
    eventName: PlaidLinkStableEvent | string,
    metadata: PlaidLinkOnEventMetadata
  ) => {
    // handle errors in the event end-user does not exit with onExit function error enabled.
    if (eventName === 'ERROR' && metadata.error_code != null) {
      setError(metadata.error_code, ' ');
    }
    logEvent(eventName, metadata);
  };

  const config: PlaidLinkOptionsWithLinkToken = {
    onSuccess,
    onExit,
    onEvent,
    token: props.token,
  };

  if (props.isOauth) {
    config.receivedRedirectUri = window.location.href; // add additional receivedRedirectUri config when handling an OAuth redirect
  }

  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    // initializes Link automatically
    if (props.isOauth && ready) {
      open();
    } else if (ready) {
      // regular, non-OAuth case:
      // set link token, userId and itemId in local storage for use if needed later by OAuth

      localStorage.setItem(
        'oauthConfig',
        JSON.stringify({
          userId: props.userId,
          itemId: props.itemId,
          token: props.token,
        })
      );
      open();
    }
  }, [ready, open, props.isOauth, props.userId, props.itemId, props.token]);

  return <></>;
}
