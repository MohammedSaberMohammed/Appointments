import React, { ReactNode, useMemo } from 'react';

import Grid from '@material-ui/core/Grid';

export type GridSize =
  | 'auto'
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12;

type Props = {
  children?: ReactNode;
  className?: string;

  xs?: boolean | GridSize;
  sm?: boolean | GridSize;
  md?: boolean | GridSize;
  lg?: boolean | GridSize;
  xl?: boolean | GridSize;

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

  return (
    <Grid item {...gridProps} className={className}>
      {children}
    </Grid>
  );
};

FormItem.defaultProps = defaultProps;

export { FormItem };
