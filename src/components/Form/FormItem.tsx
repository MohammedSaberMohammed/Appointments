import React, { ReactNode, useMemo } from 'react';

import Grid from '@material-ui/core/Grid';

type Props = {
  children?: ReactNode;
  className?: string;

  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;

  fullWidth: boolean;
} & typeof defaultProps;

const defaultProps = {
  className: '',
  fullWidth: false,

  xs: 12,
  sm: 12,
  md: 6,
  lg: 4,
  xl: 3,
};

const FormItem = (props: Props) => {
  const { children, className, xs, sm, md, lg, xl, fullWidth } = props;

  const gridProps = useMemo(() => {
    const grid = { xs, sm, md, lg, xl };

    // Handle Full width case
    if (fullWidth) {
      grid.xs = 12;
      grid.sm = 12;
      grid.md = 12;
      grid.lg = 12;
      grid.xl = 12;
    }

    return grid;
  }, [xs, sm, md, lg, xl, fullWidth]);
  console.log('gridProps', gridProps);
  return (
    <Grid item {...gridProps} className={className}>
      {children}
    </Grid>
  );
};

FormItem.defaultProps = defaultProps;

export { FormItem };
