import NotificationActions from '../store/ActionsAndReducers/Notification';
import store from '../store';

const Notifications = {
  notify: (status, message) =>
    store.dispatch(NotificationActions.notify(status, message)),
};

export default Notifications;
