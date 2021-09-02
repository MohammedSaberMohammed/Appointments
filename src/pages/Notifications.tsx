// Node Modules
import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';

// Redux
import NotificationActions from '../store/ActionsAndReducers/Notification';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

type SnackbarContentProps = {
  className: string;
  variant: 'success' | 'warning' | 'error' | 'info';
  message: any;
  onClose: () => void;
};

type GlobalNotifications = {
  notification: { active: boolean; status: string; message: string };
  clearNotification: () => void;
};

const MySnackbarContent = (props: SnackbarContentProps) => {
  const { className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      id={`${variant}-notification`}
      className={classNames(className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={'notification-message'}>
          <Icon
            className={classNames(
              'notification-icon',
              'notification-icon-variant',
            )}
          />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          onClick={onClose}
        >
          <CloseIcon className={'notification-icon'} />
        </IconButton>,
      ]}
      {...other}
    />
  );
};

const GlobalNotifications = (props) => {
  const { notification, clearNotification } = props;

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={notification?.active}
        autoHideDuration={3000}
        onClose={() => clearNotification()}
      >
        <MySnackbarContent
          onClose={() => clearNotification()}
          variant={notification?.status}
          message={notification?.message}
          {...props}
        />
      </Snackbar>
    </div>
  );
};

const mapStateToProps = (store) => ({
  notification: store.notification,
});

const mapDispatchToProps = (dispatch) => ({
  clearNotification: () => dispatch(NotificationActions.resetProp('active')),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GlobalNotifications);
