import React from 'react';
import { connect } from 'react-redux';
// Lodash
import get from 'lodash/get';
// Actions
import EntityActions from '../../store/ActionsAndReducers/Entity';
// Utils
import MutateResponse from './Utils';

type Store = {
  received: boolean;
  posted: boolean;
  updated: boolean;
  deleted: boolean;
  loading: boolean;
  error: Record<string, unknown>;
  responseFromGet: Record<string, unknown>;
  responseFromPost: Record<string, unknown>;
  responseFromUpdate: Record<string, unknown>;
  responseFromDelete: Record<string, unknown>;
};

type Props = {
  storeId: string;

  data?: Record<string, unknown>;
  entityStore?: Store;

  get?: (storeId: string, data: Record<string, unknown>) => void;
  put?: (storeId: string, data: Record<string, unknown>) => void;
  post?: (storeId: string, data: Record<string, unknown>) => void;
  delete?: (storeId: string, data: Record<string, unknown>) => void;
  update?: (storeId: string, data: Record<string, unknown>) => void;
  reset?: (storeId: string) => void;
  render?: undefined | ((store: Store) => React.ReactNode);
  register?: (storeId: string) => void;
  resetProp?: (storeId: string, prop: string) => void;
  entityRef?: (ref: any) => void;
  onEntityReceived?: (data: Record<string, unknown>) => void;
  onEntityPosted?: (data: Record<string, unknown>) => void;
  onEntityDidPut?: (data: Record<string, unknown>) => void;
  onEntityDeleted?: (data: Record<string, unknown>) => void;
  resetResponseProps?: (storeId: string) => void;
  onEntityReceivedError?: (data: Record<string, unknown>) => void;
  onEntityPostedError?: (data: Record<string, unknown>) => void;
  onEntityUpdatedError?: (data: Record<string, unknown>) => void;
  onEntityDeletedError?: (data: Record<string, unknown>) => void;
};

class Entity extends React.Component<Props> {
  componentDidMount() {
    const { register, entityRef } = this.props;

    // @workarround to give entity time to [ Register and reset ]
    // in case i reset and registered the same entity  [twice ]
    // in 2 different screens
    setTimeout(() => {
      // if there is no entity in the store with that name
      if (this.storeId && !this.store) {
        register(this.storeId);
      }
    });

    entityRef(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.storeId && this.props.storeId !== prevProps.storeId) {
      this.componentDidMount();
      return;
    }

    if (this.store) {
      const {
        received,
        posted,
        updated,
        deleted,
        error,
        responseFromGet,
        responseFromPost,
        responseFromUpdate,
        responseFromDelete,
      } = this.store;

      if (received && !error) {
        this.props.onEntityReceived(MutateResponse(responseFromGet) || {});
        this.props.resetProp(this.storeId, 'received');
      }

      if (posted && !error) {
        this.props.onEntityPosted(MutateResponse(responseFromPost) || {});
        this.props.resetProp(this.storeId, 'posted');
      }

      if (updated && !error) {
        this.props.onEntityDidPut(MutateResponse(responseFromUpdate) || {});
        this.props.resetProp(this.storeId, 'updated');
      }

      if (deleted && !error) {
        this.props.onEntityDeleted(MutateResponse(responseFromDelete) || {});
        this.props.resetProp(this.storeId, 'deleted');
      }

      if (received && error) {
        this.props.onEntityReceivedError(error || {});
        this.props.resetProp(this.storeId, 'received');
      }

      if (posted && error) {
        this.props.onEntityPostedError(error || {});
        this.props.resetProp(this.storeId, 'posted');
      }

      if (updated && error) {
        this.props.onEntityUpdatedError(error || {});
        this.props.resetProp(this.storeId, 'updated');
      }

      if (deleted && error) {
        this.props.onEntityDeletedError(error || {});
        this.props.resetProp(this.storeId, 'deleted');
      }
    }
  }

  get(data) {
    this.props.get(this.storeId, {
      ...this.props.data, // For auto get Feature
      ...data,
    });
  }

  post(data) {
    this.props.post(this.storeId, data);
  }

  put(data) {
    this.props.put(this.storeId, data);
  }

  delete(data) {
    this.props.delete(this.storeId, data);
  }

  update(data) {
    this.props.update(this.storeId, data);
  }

  reset() {
    this.props.reset(this.storeId);
  }

  resetProp(prop) {
    this.props.resetProp(this.storeId, prop);
  }

  resetResponseProps() {
    this.props.resetResponseProps(this.storeId);
  }

  get storeId() {
    const { storeId } = this.props;

    return storeId;
  }

  get store() {
    const { entityStore } = this.props;

    return get(entityStore, `byId.${this.storeId}`, null);
  }

  componentWillUnmount() {
    if (this.storeId && this.store) {
      this.reset();
    }
  }

  render() {
    const { storeId, render } = this.props;
    // Render in case there is storeId and there is store

    if (storeId && this.store && render) {
      return render(this.store);
    }

    return null;
  }
}

const mapStateToProps = (store) => ({
  entityStore: store.entity,
});

const mapDispatchToProps = (dispatch) => ({
  register: (id) => dispatch(EntityActions.register(id)),

  get: (id, data) => dispatch(EntityActions.get(id, data)),
  post: (id, data) => dispatch(EntityActions.post(id, data)),
  put: (id, data) => dispatch(EntityActions.put(id, data)),
  update: (id, data) => dispatch(EntityActions.update(id, data)),
  delete: (id, data) => dispatch(EntityActions.delete(id, data)),

  reset: (id) => dispatch(EntityActions.reset(id)),
  resetProp: (id, prop) => dispatch(EntityActions.resetProp(id, prop)),
  resetResponseProps: (id) => dispatch(EntityActions.resetResponseProps(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Entity);
