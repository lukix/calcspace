import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { selectors, actions } from './store';

interface ShopsListProps {
  shops: Array<any>;
  isFetchingShops: boolean;
  errorFetchingShops: boolean;
  fetchShops: Function;
}

const ShopsList: React.FC<ShopsListProps> = ({
  shops,
  fetchShops,
  isFetchingShops,
  errorFetchingShops,
}) => {
  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  if (isFetchingShops) {
    return <div>Loading...</div>;
  }
  if (errorFetchingShops) {
    return <div>Fetching shops failed</div>;
  }
  return (
    <div>
      {shops.slice(0, 3).map(({ title }) => (
        <div key={title}>{title}</div>
      ))}
    </div>
  );
};

export default connect(
  state => ({
    shops: selectors.shops(state),
    isFetchingShops: selectors.isFetchingShops(state),
    errorFetchingShops: selectors.errorFetchingShops(state),
  }),
  {
    fetchShops: actions.fetchShops,
  }
)(ShopsList);
