import { useCallback, useEffect, useMemo } from 'react';
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

type Props = {
  id?: string;
  name?: string;
  label?: string;
  lookup: string;
  helperText?: string;
  optionLabel?: string;
  optionValue?: string;
  placeholder?: string;
  noOptionsMessage?: string;

  lookups: Record<string, unknown>;
  selectProps?: Record<string, unknown>;

  rtl?: boolean;
  error?: boolean;
  multi?: boolean;
  loading?: boolean;
  required?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  menuIsOpen?: boolean;
  searchable?: boolean;
  adornmentBg?: boolean;
  hideSelectedOptions?: boolean;

  value: any;
  // menuPlacement: 'auto' | 'bottom' | 'top';
  menuPlacement: string;

  onChange?: (...params) => void;
  loadLookup: (name: string) => void;
  asCallbackOptionLabel?: (option: Record<string, unknown>) => any;
} & typeof defaultProps;

const defaultProps = {
  helperText: '',
  optionLabel: 'firstName',
  optionValue: 'id',
  menuPlacement: 'auto',
  noOptionsMessage: 'No choices found',

  rtl: false,
  error: false,
  multi: false,
  loading: false,
  disabled: false,
  required: false,
  clearable: true,
  searchable: true,
  hideSelectedOptions: false,
};

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

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <CaretDownIcon {...props} />
    </components.DropdownIndicator>
  );
};

const LookupSelectControl = (props: Props) => {
  const {
    id,
    rtl,
    name,
    value,
    error,
    multi,
    label,
    lookup,
    lookups,
    loading,
    onChange,
    required,
    disabled,
    clearable,
    loadLookup,
    helperText,
    searchable,
    placeholder,
    optionLabel,
    optionValue,
    menuPlacement,
    noOptionsMessage,
    hideSelectedOptions,
    asCallbackOptionLabel,
  } = props;

  useEffect(() => init(), [lookup, lookups]);

  const init = useCallback(() => {
    const loaded = get(lookups, `${lookup}.loaded`, false);
    const loading = get(lookups, `${lookup}.loading`, false);

    if (!loaded && !loading) {
      loadLookup(lookup);
    }
  }, [lookup, lookups]);

  const handleChangeSelection = useCallback(
    (selectedValue) => {
      const fieldValue = selectedValue ? selectedValue[optionValue] : '';

      if (name) {
        return onChange(name, fieldValue);
      }

      return onChange(fieldValue);
    },
    [name, onChange, optionValue],
  );

  const lookupData = useMemo(() => {
    return get(lookups, `${lookup}.data`, []);
  }, [lookup, lookups]);

  const currentValue = useMemo(() => {
    const defaultValue = find(lookupData, [optionValue, value]);

    return defaultValue || '';
  }, [value, optionValue]);

  const selectStyles = useMemo(() => {
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

          padding: 15,
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
        paddingRight: 15,
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
  }, []);

  return (
    <FormControl className={'formControl'} fullWidth required={required}>
      {label && (
        <InputLabel htmlFor={`${name}-${id}`} error={error} id="dropdown-label">
          {label}
        </InputLabel>
      )}

      <Select
        id={`${name}-${id}-Lookup-Select`}
        name={name}
        isRtl={rtl}
        isMulti={multi}
        options={Immutable.asMutable(lookupData, { deep: true })}
        isLoading={loading}
        value={currentValue}
        isDisabled={disabled}
        styles={selectStyles}
        // inputValue={} ----> searchInputValue
        isClearable={clearable}
        placeholder={placeholder}
        isSelected={false}
        isSearchable={searchable}
        menuPlacement={menuPlacement}
        getOptionLabel={(option) =>
          asCallbackOptionLabel
            ? asCallbackOptionLabel(option)
            : `${option[optionLabel]}`
        }
        getOptionValue={(option) => `${option[optionValue]}`}
        classNamePrefix={'select'}
        className={'static-lookup-select'}
        onChange={(val) => handleChangeSelection(val)}
        hideSelectedOptions={hideSelectedOptions}
        // user
        noOptionsMessage={() => noOptionsMessage}
        // override components
        components={{
          DropdownIndicator,
        }}
      />
      <FormHelperText id={`${name}-${id}-helper-text`} error={error}>
        {helperText}
      </FormHelperText>
    </FormControl>
  );
};

const mapStateToProps = (store) => ({
  lookups: store.lookups,
});

const mapDispatchToProps = (dispatch) => ({
  loadLookup: (lookup) => dispatch(LookupsActions.get(lookup)),
});

LookupSelectControl.defaultProps = defaultProps;

export const LookupSelect = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LookupSelectControl);
