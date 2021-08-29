import React, { ReactNode } from 'react';
import classNames from 'classnames';

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
  const { loading, children, className } = props;

  return (
    <React.Fragment>
      {loading && (
        <div className={`loading ${className}`}>
          <Loading />
        </div>
      )}

      <Grid
        container
        className={classNames(className, { 'blurry-grid': loading })}
        spacing={2}
      >
        {children}
      </Grid>
    </React.Fragment>
  );
};

FormLayout.defaultProps = defaultProps;

export { FormLayout };
