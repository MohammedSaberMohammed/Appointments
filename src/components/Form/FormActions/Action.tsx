import React, { useCallback } from 'react';
import classnames from 'classnames';

import Button from '@material-ui/core/Button';

type Color = 'inherit' | 'primary' | 'secondary' | 'default';

type Props = {
  variant?: string;
  label?: string;
  disabled?: boolean;
  color?: Color;
  styles?: Record<string, unknown>;
  left?: boolean;
  right?: boolean;
  component?: any;
  primaryAction?: boolean;
  hidden?: boolean;

  onClick?: () => void;
} & typeof defaultProps;

const defaultProps = {
  label: '',
  // color: 'secondary',

  disabled: false,
  primaryAction: false,
  left: false,
  right: false,
  hidden: false,
  styles: {},

  onClick() {},
};

const Action = (props: Props) => {
  const {
    left,
    right,
    label,
    onClick,
    disabled,
    primaryAction,
    component,
    color,
    hidden,
    styles,
  } = props;

  const computedClassNames = useCallback(() => {
    return classnames('stepperActionButton', {
      right,
      left,
      theme_primary_button: primaryAction,
      theme_secondary_button: !primaryAction,
    });
  }, [left, right]);

  if (hidden) {
    return null;
  }

  if (component) {
    return <div className={computedClassNames()}>{component}</div>;
  }

  return (
    <Button
      key={label}
      onClick={onClick}
      className={computedClassNames()}
      style={styles}
      size={'small'}
      color={primaryAction ? 'primary' : color}
      variant={primaryAction ? 'contained' : 'outlined'}
      disabled={disabled}
    >
      {label}
    </Button>
  );
};

Action.defaultProps = defaultProps;

export default Action;
