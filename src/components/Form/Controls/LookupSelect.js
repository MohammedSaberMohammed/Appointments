import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Immutable from 'seamless-immutable';

import Image from 'next/image';

// Actions
import LookupsActions from '../../../store/ActionsAndReducers/Lookups';
// Lodash
import get from 'lodash/get';
import find from 'lodash/find';
// Select
import Select, { components } from 'react-select';
// MUI
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

const CaretDownIcon = (props) => {
  const { selectProps } = props;

  return (
    <Image
      width="20"
      height="20"
      src={'/toggle-down.svg'}
      alt={'indicator'}
      className={classNames('dropdown-indicator', {
        'upper-indicator': selectProps.menuIsOpen,
      })}
    />
  );
};

/**
 * LookupSelectControl Component
 * @augments {Component<Props, State>}
 */
class LookupSelectControl extends React.Component {
  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps) {
    const { lookup } = this.props;

    if (lookup !== prevProps.lookup) {
      this.init();
    }
  }

  init() {
    const { lookups, lookup } = this.props;
    const loaded = get(lookups, `${lookup}.loaded`, false);
    const loading = get(lookups, `${lookup}.loading`, false);

    if (!loaded && !loading) {
      this.props.loadLookup(lookup);
    }
  }

  handleChangeSelection = (selectedValue) => {
    const { name, onChange, optionValue } = this.props;
    const fieldValue = selectedValue ? selectedValue[optionValue] : '';

    if (name) {
      return onChange(name, fieldValue);
    }

    return onChange(fieldValue);
  };

  dropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <CaretDownIcon {...props} />
      </components.DropdownIndicator>
    );
  };

  get value() {
    const { value, optionValue } = this.props;

    const defaultValue = find(this.lookupData, [`${optionValue}`, value]);
    return defaultValue;
  }

  get lookupData() {
    const { lookup, lookups } = this.props;

    return get(lookups, `${lookup}.data`, []);
  }

  ValueContainer = ({ children, ...props }) => {
    const { rightAdornment } = this.props;
    return (
      components.ValueContainer && (
        <components.ValueContainer {...props}>
          {!!children && rightAdornment && (
            <div style={{ minWidth: 35, textAlign: 'center' }}>
              {rightAdornment}
            </div>
          )}
          {children}
        </components.ValueContainer>
      )
    );
  };

  get selectStyles() {
    const { rightAdornment } = this.props;
    return {
      menu: (provided) => ({
        ...provided,
        zIndex: 200,
      }),
      option: (provided, { isSelected }) => {
        return {
          ...provided,
          transition: 'all .3s ease-out',
          borderBottom: '1px dotted #BA0D2F',
          color: isSelected ? '#fff' : '#BA0D2F',
          backgroundColor: isSelected ? '#BA0D2F' : '#fff',
          fontWeight: isSelected ? 600 : 'normal',

          padding: 20,
          cursor: 'pointer',
          ':hover': {
            background: isSelected ? '#BA0D2F' : '#d4355478',
            color: '#fff',
            fontWeight: 600,
          },
        };
      },
      control: (provided) => ({
        // none of react-select's styles are passed to <Control />
        ...provided,
        height: '45px',
        borderRadius: '30px',
        paddingRight: !rightAdornment ? 15 : 0,
        border: 'solid 1px #ba0d2f',
        boxShadow: 'unset',
        cursor: 'pointer',
        ':hover': {
          borderColor: '#ba0d2f',
        },
        ':focus': {
          height: '45px',
        },
      }),
    };
  }

  render() {
    const {
      id,
      rtl,
      name,
      error,
      multi,
      label,
      loading,
      required,
      disabled,
      clearable,
      helperText,
      searchable,
      placeholder,
      optionLabel,
      optionValue,
      menuPlacement,
      noOptionsMessage,
      hideSelectedOptions,
      rightAdornment,
      asCallbackOptionLabel,
    } = this.props;

    return (
      <FormControl className={'formControl'} fullWidth required={required}>
        {label && (
          <InputLabel
            htmlFor={`${name}-${id}`}
            error={error}
            id="dropdown-label"
          >
            {label}
          </InputLabel>
        )}

        <Select
          id={`${name}-${id}-Lookup-Select`}
          name={name}
          isRtl={rtl}
          isMulti={multi}
          options={Immutable.asMutable(this.lookupData, { deep: true })}
          isLoading={loading}
          value={this.value}
          isDisabled={disabled}
          styles={this.selectStyles}
          // inputValue={} ----> searchInputValue
          isClearable={clearable}
          placeholder={placeholder}
          isSearchable={searchable}
          menuPlacement={menuPlacement}
          getOptionLabel={(option) =>
            asCallbackOptionLabel
              ? asCallbackOptionLabel(option)
              : `${option[optionLabel]}`
          }
          getOptionValue={(option) => `${option[optionValue]}`}
          classNamePrefix={'select'}
          className={`static-lookup-select ${
            rightAdornment ? 'select-right-adornment ' : ''
          }`}
          onChange={this.handleChangeSelection}
          hideSelectedOptions={hideSelectedOptions}
          // user
          noOptionsMessage={() => noOptionsMessage}
          // override components
          components={{
            DropdownIndicator: this.dropdownIndicator,
            ValueContainer: this.ValueContainer,
          }}
          // override Theme
          // theme={theme => }
        />
        <FormHelperText id={`${name}-${id}-helper-text`} error={error}>
          {helperText}
        </FormHelperText>
      </FormControl>
    );
  }
}

const mapStateToProps = (store) => ({
  lookups: store.lookups,
});

const mapDispatchToProps = (dispatch) => ({
  loadLookup: (lookup) => dispatch(LookupsActions.get(lookup)),
});

LookupSelectControl.propTypes = {
  automationTestId: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  lookup: PropTypes.string,
  helperText: PropTypes.string,
  optionLabel: PropTypes.string,
  optionValue: PropTypes.string,
  placeholder: PropTypes.string,
  noOptionsMessage: PropTypes.string,

  lookups: PropTypes.object,
  selectProps: PropTypes.object,

  rightAdornment: PropTypes.node,

  rtl: PropTypes.bool,
  error: PropTypes.bool,
  multi: PropTypes.bool,
  loading: PropTypes.bool,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  clearable: PropTypes.bool,
  menuIsOpen: PropTypes.bool,
  searchable: PropTypes.bool,
  adornmentBg: PropTypes.bool,
  hideSelectedOptions: PropTypes.bool,

  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]), // Based on multi value
  menuPlacement: PropTypes.oneOf(['auto', 'bottom', 'top']),

  onChange: PropTypes.func,
  loadLookup: PropTypes.func,
  asCallbackOptionLabel: PropTypes.func,
};

LookupSelectControl.defaultProps = {
  automationTestId: '',
  helperText: '',
  optionLabel: 'firstName',
  optionValue: 'id',
  menuPlacement: 'auto',
  noOptionsMessage: 'No choices found',

  lookups: {},
  selectProps: {},

  rtl: false,
  error: false,
  multi: false,
  loading: false,
  disabled: false,
  required: false,
  clearable: true,
  searchable: true,
  hideSelectedOptions: false,

  onChange() {},
  loadLookup() {},
};

export const LookupSelect = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LookupSelectControl);
