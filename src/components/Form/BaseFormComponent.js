import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UniqueId from '@team-griffin/react-unique-id';

import each from 'lodash/each';
import get from 'lodash/get';
import set from 'lodash/set';
import reduce from 'lodash/reduce';
import find from 'lodash/find';
import map from 'lodash/map';
import forEach from 'lodash/forEach';
import isNull from 'lodash/isNull';
import pickBy from 'lodash/pickBy';
import has from 'lodash/has';
import isUndefined from 'lodash/isUndefined';
import omit from 'lodash/omit';
import isArray from 'lodash/isArray';

import { LookupSelect, StaticLookupSelect } from './Controls';

const FORM_KEY = 'form';
const INITIAL_FORM_KEY = 'initialForm';
const ACTIONS_KEY = 'actions';
const ENABLE_ERROR_MESSAGE_KEY = 'enableFormErrorMessage';
const ERROR_MESSAGE_KEY = 'formErrorMessage';

const blackhole = () => {};

class Types {
  static number(something) {
    if (!something && something !== 0) {
      return '';
    }
    return Number(something);
  }

  static string(something) {
    return `${something}`;
  }

  static bool(something) {
    return Boolean(something);
  }

  static list(value) {
    return map(value, (item) => item.value);
  }

  static object(value) {
    if (!value) {
      return {};
    }

    return value;
  }

  static arrayOfNumbers(something) {
    if (!something || !isArray(something)) {
      return [];
    }

    return something.map((item) => Number(item));
  }

  static arrayOfObjects(something) {
    if (!something || !isArray(something)) {
      return [];
    }

    return something;
  }
}

class FieldState {
  constructor(args) {
    // if (Array.isArray(args.value)) {
    //   return new ListFieldState(args);
    // }

    const { validateOn, ...restOptions } = args;

    return {
      showErrors: false,
      validators: [],
      validateOn: [...(validateOn || []), 'value'],
      errors: [],
      value: '',
      type: Types.string,
      UIOnly: false,
      ignoreTypeValidation: false,
      ...restOptions,
      initialValue: '',
    };
  }
}

class ListFieldState {
  constructor({ value, ...rest }) {
    // make a field state without value to avoid infinite recursion
    const listField = new FieldState(rest);

    // attach value
    listField.value = map(value, (item) => new FieldState(item));
    listField.initialValue = map(value, (item) => new FieldState(item));

    return listField;
  }
}

class FormState {
  constructor(formDefinition) {
    const formState = reduce(
      formDefinition,
      (form, options, name) =>
        set(form, name, new FieldState({ name, ...options })),
      {},
    );

    return formState;
  }
}

class BaseFormComponent extends Component {
  constructor() {
    super();

    this.FieldState = FieldState;
    this.ListFieldState = ListFieldState;
    this.types = Types;
    this._initFields();
    this._listeners = {};
  }

  componentDidMount() {
    this.validateForm(); // validate initial values
  }

  initState({ form, ...restState }) {
    this.state = {
      // the global form error message
      [ENABLE_ERROR_MESSAGE_KEY]: false,
      [ERROR_MESSAGE_KEY]: '',

      // component specific state
      ...restState,

      // safe form state
      [FORM_KEY]: new FormState(form),
      // plceholder for the initial form state
      [INITIAL_FORM_KEY]: new FormState(form),
    };
  }

  getUpdatedFieldState = (name, fieldUpdater) => {
    const fieldState = this.getFieldState(name);

    // list
    if (Array.isArray(fieldState.value) && !fieldState.ignoreTypeValidation) {
      const updatedChildrenState = [];

      // iterate over children and update list items
      for (let i = 0; i < fieldState.value.length; i++) {
        updatedChildrenState.push(
          this.getUpdatedFieldState(`${name}.value.${i}`, fieldUpdater),
        );
      }

      return {
        ...fieldState,
        ...fieldUpdater(name, updatedChildrenState),
        value: updatedChildrenState,
      };
    }

    // object
    return {
      ...fieldState,
      ...fieldUpdater(name, fieldState.value),
    };
  };

  // this method takes field updater as first argument
  // and the rest are general state updaters
  stateUpdater = ({ fieldUpdater, stateUpdaters, callback }) => {
    callback = callback || blackhole;
    fieldUpdater = fieldUpdater || blackhole;
    stateUpdaters = stateUpdaters || [];

    const newFormState = reduce(
      this.formState,
      (formState, field, name) => {
        return set(
          formState,
          name,
          this.getUpdatedFieldState(name, fieldUpdater),
        );
      },
      {},
    );

    const newState = reduce(
      stateUpdaters,
      (state, updater) => {
        return {
          ...state,
          ...updater(state),
        };
      },
      {
        // initial state including new 'form' state
        ...this.state,
        [FORM_KEY]: newFormState,
      },
    );

    this.setState(newState, callback);
  };

  // updates a field key, and then run field validators if that key in 'validateOn'
  setFieldKey = (name, key, value, callback = blackhole) =>
    setTimeout(() => {
      const newFormState = set(this.formState, name, {
        ...this.getFieldState(name),
        [key]: value,
      });

      this.setState(
        {
          [FORM_KEY]: newFormState,
        },
        () => {
          // run validator on special keys
          if (
            this.getFieldState(name).validateOn &&
            this.getFieldState(name).validateOn.indexOf(key) !== -1
          ) {
            this.validateField(name, callback);
          } else {
            callback();
          }
        },
      );
    });

  resetFormValues = (callback = blackhole) => {
    this.setState(
      {
        [FORM_KEY]: this.state[INITIAL_FORM_KEY],
      },
      () => {
        this.validateForm(callback);
      },
    );
  };

  updateFormValues = (form = {}, callback = blackhole) => {
    const newFormState = reduce(
      this.formState,
      (fieldsState, field, name) => {
        // only update fields in 'form' object
        if (name in form === false) {
          return fieldsState;
        }

        let value = '';
        if (this.formState[name].ignoreTypeValidation) {
          value = field.type(form[name]);
        } else if (Array.isArray(form[name])) {
          value = map(form[name], (item, index) => ({
            ...form[name][index],
            value: item,
          }));
        } else {
          value = isNull(form[name])
            ? value || this.formValues[name]
            : field.type(form[name]);
        }

        return set(
          fieldsState,
          name,
          new FieldState({ name, ...field, value }),
        );
      },
      {},
    );

    this.setState(
      {
        [FORM_KEY]: {
          ...this.formState,
          ...newFormState,
        },
      },
      () => {
        this.validateForm(callback);
      },
    );
  };

  addFormFields = (fields, callback = blackhole) => {
    const newFieldsState = reduce(
      fields,
      (fieldsState, field, name) => {
        return set(fieldsState, name, new FieldState({ name, ...field }));
      },
      {},
    );

    this.setState(
      {
        [FORM_KEY]: {
          ...this.formState,
          ...newFieldsState,
        },
      },
      () => {
        this.validateForm();
        // setTimeout to aviod state update collision
        setTimeout(() => callback());
      },
    );
  };

  setFieldsValues = (values, callback = blackhole) => {
    const newFieldsState = reduce(
      values,
      (fieldsState, value, name) => {
        const field = this.getFieldState(name);

        return set(
          fieldsState,
          name,
          new FieldState({
            ...field,
            name,
            value,
          }),
        );
      },
      {},
    );

    this.setState(
      {
        [FORM_KEY]: {
          ...this.formState,
          ...newFieldsState,
        },
      },
      () => {
        this.validateForm();
        callback();
      },
    );
  };

  removeFormFields = (fields = [], callback = blackhole) => {
    const newFormState = pickBy(
      this.formState,
      (field, name) => fields.indexOf(name) === -1,
    );

    this.setState(
      {
        [FORM_KEY]: newFormState,
      },
      () => {
        this.validateForm();
        callback();
      },
    );
  };

  // this method takes some fields to add and some fields to remove
  updateFormFields = ({ add, remove }, callback = blackhole) => {
    add = add || {};
    remove = remove || [];

    // filter existing fields
    const newFormState = pickBy(
      this.formState,
      (field, name) => remove.indexOf(name) === -1,
    );

    // new fields
    const newFieldsState = reduce(
      add,
      (fieldsState, field, name) => {
        return set(fieldsState, name, new FieldState({ name, ...field }));
      },
      {},
    );

    this.setState(
      {
        [FORM_KEY]: {
          ...newFormState,
          ...newFieldsState,
        },
      },
      () => {
        this.validateForm();
        callback();
      },
    );
  };

  // a shorthand for setFieldKey('value')
  setFieldValue = (name, value, callback) =>
    this.setFieldKey(name, 'value', value, callback);

  // use this function to show specific field errors before submitting the form
  showFieldErrors = (name) => this.setFieldKey(name, 'showErrors', true);
  hideFieldErrors = (name) => this.setFieldKey(name, 'showErrors', false);

  // use this function to show specific field errors before submitting the form
  showFieldsErrors = (fields = []) => {
    const newFieldsState = {};

    forEach(fields, (field) => {
      newFieldsState[field] = {
        ...this.formState[field],
        showErrors: true,
      };
    });

    this.addFormFields(newFieldsState);
  };

  hideFieldsErrors = (fields = []) => {
    const newFieldsState = {};

    forEach(fields, (field) => {
      newFieldsState[field] = {
        ...this.formState[field],
        showErrors: false,
      };
    });

    this.addFormFields(newFieldsState);
  };

  // Because the _onFieldChange is getting called so many times
  // precisely each key stroke, we MUST keep it as effecient as possible
  // we should make as less side effects as possible and encapsulate some logic
  // inside the _onFieldChange although it might seem not to belong to this function
  _onFieldChange =
    (callback = blackhole) =>
    (name, value, ...restParams) => {
      const field = this.getFieldState(name);

      let newFormState = set(this.state[FORM_KEY], name, {
        ...field,
        errors: this.getFieldErrors(name, field.type(value)),
        value: field.type(value),
      });

      // has parent
      let parentPath = name;

      // iterate over parents from bottom to top
      while (parentPath.indexOf('.value.') !== -1) {
        const lastSeparatorIndex = parentPath.lastIndexOf('.value.');
        parentPath = parentPath.substr(0, lastSeparatorIndex);

        const parentState = get(newFormState, parentPath);

        newFormState = set(newFormState, parentPath, {
          ...parentState,
          errors: this.getFieldErrors(parentPath, parentState.value),
        });
      }

      let newState = {
        ...this.state,
        [FORM_KEY]: newFormState,
      };

      newState = {
        ...newState,
        ...this._getFormGlobalErrorMessageState(newState),
      };

      this.setState(newState, () => {
        this.notify('field-changed', name, value);
        callback(this.getFieldState(name), ...restParams);
      });
    };

  getFieldErrors = (name, value) => {
    const field = this.getFieldState(name);
    const validators = field.validators;
    const errors = [];

    if (!field.validators) {
      return errors;
    }

    // cach length for sake of performance
    // as this method gets called each key stroke
    for (let index = 0, len = validators.length; index < len; index++) {
      const validationResult = validators[index].validate(
        value,
        field,
        this.formState,
      );

      if (validationResult.valid === false) {
        errors.push(validationResult);
      }
    }

    return errors;
  };

  validateField = (name, callback = blackhole) => {
    const field = this.getFieldState(name);
    const errors = this.getFieldErrors(name, field.value);

    this.setFieldKey(name, 'errors', errors, callback);
  };

  // iterates throw all form fields and runs the field validations
  // this method is being automatically called on componentDidMount() to set
  // initial fields validations
  // and it can be explicitly called from components
  // ----------
  // IMPORTANT: As not to setState for each field
  // we encapsulated the whole state change into one call
  validateForm = (callback = blackhole) => {
    this.stateUpdater({
      fieldUpdater: (name, value) => ({
        errors: this.getFieldErrors(name, value),
      }),
      callback,
    });

    this._broadcastFormStatusChange();
  };

  _getFieldKeyValue = (name, key) => this.getFieldState(name)[key];

  getFieldHasError = (name) => {
    // const fieldState = this.getFieldState(name);

    // if (Array.isArray(fieldState.value)) {
    //   return reduce(fieldState.value, (hasError, field, index) => hasError || this.getFieldHasError(`${name}.value.${index}`), false);
    // }

    return Boolean(
      this.getFieldState(name).showErrors &&
        this.getFieldState(name).errors.length,
    );
  };

  _getFieldIsRequired = (name) =>
    Boolean(
      find(
        this.getFieldState(name).validators,
        (v) => v.key === 'REQUIRED' || v.key === 'OBJECT_REQUIRED',
      ),
    );

  // returns first error message if exist
  // otherwise, retunrs 'helperMessage' if exist
  // otherwise, empty string
  _getFieldHelperMessage = (name, helperMessage = '') => {
    if (this.getFieldHasError(name)) {
      return get(this.getFieldState(name), 'errors.0.message');
    }

    return helperMessage;
  };

  // ACTIONS
  disableAction = (name) => this.setActionKey(name, 'disabled', true);
  disableAllActions = () =>
    each(this.state[ACTIONS_KEY], (field, name) =>
      this.setActionKey(name, 'disabled', true),
    );
  removeActions = (actions) =>
    this.setState({ [ACTIONS_KEY]: omit(this.state[ACTIONS_KEY], actions) });
  addActions = (actions, callback = blackhole) =>
    this.setState(
      { [ACTIONS_KEY]: { ...this.state[ACTIONS_KEY], ...actions } },
      callback,
    );

  enableAction = (name) => this.setActionKey(name, 'disabled', false);
  enableAllActions = () =>
    each(this.state[ACTIONS_KEY], (field, name) =>
      this.setActionKey(name, 'disabled', false),
    );

  setActionKey = (name, key, value) =>
    setTimeout(() =>
      this.setState({
        [ACTIONS_KEY]: {
          ...this.state[ACTIONS_KEY],
          [name]: {
            ...this.state[ACTIONS_KEY][name],
            [key]: value,
          },
        },
      }),
    );

  // call this whenever you want to showErrors
  // for example, after form submit click
  showFormErrors = (callback) => {
    this.stateUpdater({
      fieldUpdater: () => ({
        // field updater
        showErrors: true,
      }),
      stateUpdaters: [
        // set global state 'enabelErrorMessage'
        () => ({
          [ENABLE_ERROR_MESSAGE_KEY]: true,
        }),

        // update global error message state
        (state) => this._getFormGlobalErrorMessageState(state),
      ],
      callback,
    });
  };

  hideFormErrors = (callback) => {
    this.stateUpdater({
      fieldUpdater: () => ({
        // field updater
        showErrors: false,
      }),
      stateUpdaters: [
        // set global state 'enabelErrorMessage'
        () => ({
          [ENABLE_ERROR_MESSAGE_KEY]: false,
        }),

        // update global error message state
        (state) => this._getFormGlobalErrorMessageState(state),
      ],
      callback,
    });
  };

  get formState() {
    return this.state[FORM_KEY];
  }

  get isFormValid() {
    return this._isFormValid(this.formState);
  }

  get formValues() {
    // reduces form state to form values
    // and only pick non-ui fields
    return reduce(
      this.formState,
      (formValue, field, name) => {
        if (field.UIOnly) {
          return formValue;
        }

        const convertedValue = field.value
          ? field.type(field.value)
          : field.value;

        return set(formValue, name, convertedValue);
      },
      {},
    );
  }

  getFieldState = (name) => get(this.formState, name);

  fieldIsValid = (name) => this.formState[name].errors.length === 0;

  _makeCommonFieldProps = (props) => {
    let value = this._getFieldKeyValue(props.name, 'value');

    if (isUndefined(value) || isNull(value)) {
      value = '';
    }

    return {
      value,
      required: this._getFieldIsRequired(props.name),
      error: this.getFieldHasError(props.name),
      helperText: this._getFieldHelperMessage(props.name, props.helperText),
      onChange: this._onFieldChange(props.onChange),
      fieldState: this.getFieldState(props.name),
    };
  };

  // Field Factories
  _initFields() {
    const fieldsMap = {
      LookupSelectField: LookupSelect,
      StaticLookupSelectField: StaticLookupSelect,
    };

    // HOC
    each(fieldsMap, (WrappedComponent, FieldName) => {
      this[FieldName] = (props) => {
        const { readOnlyMode } = this.props;
        const readOnly = readOnlyMode || this.state.readOnlyMode;

        if (!props.name) {
          console.warn(
            `Skipping field ${FieldName} as it's missing a 'name' prop`,
          );
          return null;
        }

        if (!has(this.formState, props.name)) {
          console.warn(
            `Skipping field ${props.name} as it's missing in the formState`,
          );
          return null;
        }

        return (
          <UniqueId
            render={(UniqueProps) => (
              <WrappedComponent
                form={this}
                disabled={
                  readOnly ||
                  props.disabled ||
                  this.getFieldState(props.name).disabled
                }
                {...props}
                {...this._makeCommonFieldProps(props)}
                id={UniqueProps.id}
              />
            )}
          />
        );
      };
    });
  }

  // broadcast the form status
  _broadcastFormStatusChange = () =>
    setTimeout(() => {
      if (this.isFormValid) {
        this.notify('formValid');
      } else {
        this.notify('formInvalid');
      }
    });

  _isFormValid = (formState) =>
    reduce(
      formState,
      (valid, field) => valid && field.errors.length === 0,
      true,
    );

  _getFormGlobalErrorMessageState = (state) => {
    const isFormValid = this._isFormValid(state.form);

    let errorMessageValue = false;

    if (isFormValid) {
      errorMessageValue = false;

      // show error message if form submitted
    } else if (state[ENABLE_ERROR_MESSAGE_KEY]) {
      errorMessageValue = 'Please Review Errors';

      // form is invalid BUT 'enable' is false
    } else {
      errorMessageValue = false;
    }

    return {
      [ERROR_MESSAGE_KEY]: errorMessageValue,
    };
  };

  setFieldValidators = (name, validators, callback = blackhole) => {
    const field = this.formState[name];

    if (field) {
      this.setFieldKey(name, 'validators', validators, () => {
        this.validateForm();
        callback();
      });
    }
  };

  // Error Message
  showFormErrorMessage = (message = 'Please review errors') =>
    this.setState({ [ERROR_MESSAGE_KEY]: message });
  hideFormErrorMessage = () => this.setState({ [ERROR_MESSAGE_KEY]: false });

  // subscribe on events
  on(event, listener) {
    this._listeners[event] = this._listeners[event] || [];
    this._listeners[event].push(listener);
  }

  notify(event, ...args) {
    this._listeners[event] = this._listeners[event] || [];
    this._listeners[event].forEach((listener) => listener(...args));
  }
}

BaseFormComponent.propTypes = {
  readOnlyMode: PropTypes.bool,
};

export { BaseFormComponent };
