import React from 'react';
import useUser from '../hooks/useUser';
import { pluralize } from '../util';

interface Props {
  numOfItems: number;
  hovered: boolean;
}

const UserDetails = ({ numOfItems, hovered }: Props) => {
  const { user } = useUser();
  return (
    <>
      <div className="user-card__column-1">
        <h3 className="heading">User name</h3>
        <p className="value">{user.nickname || user.name}</p>
      </div>
      <div className="user-card__column-3">
        <h3 className="heading">Number of banks connected</h3>
        <p className="value">
          {hovered ? 'View ' : ''}{' '}
          {`${numOfItems} ${pluralize('bank', numOfItems)}`}
        </p>
      </div>
    </>
  );
};
export default UserDetails;
