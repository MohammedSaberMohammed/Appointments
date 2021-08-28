import React from 'react';
import map from 'lodash/map';

import Typography from '@material-ui/core/Typography';

import Action from './Action';

type Props = {
  actions?: Record<string, unknown>;
  validationMessage?: string;
} & typeof defaultProps;

const defaultProps = {
  validationMessage: '',

  actions: {},
};

const FormActions = (props: Props) => {
  const { actions, validationMessage } = props;

  if (Object.keys(actions).length === 0) {
    return null;
  }

  return (
    <React.Fragment>
      {validationMessage && (
        <Typography
          key={'error-message'}
          className={'errorMessage'}
          variant="subtitle1"
        >
          {validationMessage}
        </Typography>
      )}
      <div key={'actions'} className={'stepperFooter'}>
        {map(actions, (action, index) => (
          <Action key={index} {...action} />
        ))}
      </div>
    </React.Fragment>
  );
};

FormActions.defaultProps = defaultProps;

export default FormActions;
