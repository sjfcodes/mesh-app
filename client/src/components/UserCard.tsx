import React, { useEffect, useState } from 'react';
// import { HashLink } from 'react-router-hash-link';
import Button from '../components/Button/Button';
import Touchable from 'plaid-threads/Touchable';

// import { UserDetails } from '.';

// import { useItems, useUsers, useLink } from '../services';
import { UserType } from '../types';
import useLink from '../hooks/useLink';
import LaunchLink from './LaunchLink';

interface Props {
  user: UserType;
  removeButton: boolean;
  linkButton: boolean;
  userId: string;
}

export default function UserCard(props: Props) {
  const [numOfItems, setNumOfItems] = useState(0);
  const [token, setToken] = useState('');
  const [hovered, setHovered] = useState(false);
  // const { itemsByUser, getAllItems } = useItems();
  const { generateLinkToken, linkTokens } = useLink();

  const initiateLink = async () => {
    // only generate a link token upon a click from enduser to add a bank;
    // if done earlier, it may expire before enduser actually activates Link to add a bank.
    await generateLinkToken(props.userId, null);
  };

  // // update data store with the user's items
  // useEffect(() => {
  //   if (props.userId) {
  //     getAllItems(props.userId, true);
  //   }
  // }, [getAllItems, props.userId]);

  // // update no of items from data store
  // useEffect(() => {
  //   if (itemsByUser[props.userId] != null) {
  //     setNumOfItems(itemsByUser[props.userId].length);
  //   } else {
  //     setNumOfItems(0);
  //   }
  // }, [itemsByUser, props.userId]);

  useEffect(() => {
    setToken(linkTokens.byUser[props.userId]);
  }, [linkTokens, props.userId, numOfItems]);

  return (
    <div className="box user-card__box">
      <div className=" card user-card">
        <div
          className="hoverable"
          onMouseEnter={() => {
            if (numOfItems > 0) {
              setHovered(true);
            }
          }}
          onMouseLeave={() => {
            setHovered(false);
          }}
        >
          <Touchable
            className="user-card-clickable"
            // component={HashLink}
            to={`/user/${props.userId}#itemCards`}
          >
            <div className="user-card__detail">
              {/* <UserDetails
                hovered={hovered}
                user={props.user}
                numOfItems={numOfItems}
              /> */}
            </div>
          </Touchable>
        </div>
        {(props.removeButton || (props.linkButton && numOfItems === 0)) && (
          <div className="user-card__buttons">
            {props.linkButton && numOfItems === 0 && (
              <Button onClick={initiateLink}>Add a bank</Button>
            )}
            {token != null &&
              token.length > 0 &&
              props.linkButton &&
              numOfItems === 0 && (
                <LaunchLink userId={props.userId} token={token} itemId={null} />
              )}
          </div>
        )}
      </div>
    </div>
  );
}
