import { useMemo, useEffect } from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import find from 'lodash/find';

import LookupsActions from '../../../store/ActionsAndReducers/Lookups';
import Loading from 'components/Loading';

type Props = {
  lookups: Record<string, unknown>;
  lookup: string;
  value: any;
  loadLookup: (lookup: string) => [];
};

const LookupStringControl = (props: Props) => {
  const { lookups, lookup, value, loadLookup } = props;

  useEffect(() => {
    const loaded = get(lookups, `${lookup}.loaded`, false);
    const loading = get(lookups, `${lookup}.loading`, false);

    if (!loaded && !loading) {
      loadLookup(lookup);
    }
  }, []);

  const lookupData = useMemo(
    () => get(lookups, `${lookup}.data`, []),
    [lookups, lookup],
  );

  const getValue = useMemo(() => {
    const selectedValue = find(lookupData, ['id', value]);

    if (selectedValue) {
      return selectedValue.firstName + selectedValue.lastName;
    }

    return '...';
  }, [lookups, lookup, value]);

  const isLoading = useMemo(
    () => get(lookups, `${lookup}.loading`, false),
    [lookups, lookup],
  );

  return isLoading ? <Loading /> : getValue;
};

const mapStateToProps = (store) => ({
  lookups: store.lookups,
});

const mapDispatchToProps = (dispatch) => ({
  loadLookup: (lookup) => dispatch(LookupsActions.get(lookup)),
});

export const LookupString = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LookupStringControl);
