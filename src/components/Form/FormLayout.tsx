import React, { ReactNode } from 'react';

import Grid from '@material-ui/core/Grid';

import Loading from '../Loading';

type Props = {
  className?: string;
  loading?: boolean;
  children: ReactNode;
} & typeof defaultProps;

const defaultProps = {
  className: '',

  loading: false,
};

const FormLayout = (props: Props) => {
  const { loading, children } = props;

  return (
    <React.Fragment>
      {loading && (
        <div className={'loading'}>
          <Loading />
        </div>
      )}

      <Grid
        container
        className={`${loading ? 'blurry-grid' : ''} `}
        spacing={2}
      >
        {children}
      </Grid>
    </React.Fragment>
  );
};

FormLayout.defaultProps = defaultProps;

export { FormLayout };
