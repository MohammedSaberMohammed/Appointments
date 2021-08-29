import React from 'react';
import PropTypes from 'prop-types';
// MUI
import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
// Services
import { isRequired } from '../Services/Validators';
import { formatDateRange } from 'utils/date';
// Components
import Entity from './Entity';
import { FormLayout, FormItem, BaseFormComponent, FormActions } from './Form';

class AppointmentForm extends BaseFormComponent {
  appointmentsEntity;
  availabilitiesEntity;

  constructor() {
    super();

    this.initState({
      availabilities: [],
      isAvailabilitiesLoading: false,
      startDate: '',
      endDate: '',

      form: {
        patientId: {
          type: this.types.number,
          validators: [isRequired()],
        },
        practitionerId: {
          type: this.types.number,
          validators: [isRequired()],
        },
        availabilities: {
          type: this.types.number,
          validators: [isRequired()],
          UIOnly: true,
        },
      },
      actions: {
        submit: {
          label: 'Make a reservation',
          primaryAction: true,
          left: true,
          onClick: () => this.onSubmit(),
        },
      },
    });
  }

  componentDidMount() {
    // To trigger the initial validation for the form
    super.componentDidMount();
  }

  onSubmit = () => {
    if (this.isFormValid) {
      const { startDate, endDate } = this.state;

      const payload = {
        ...this.formValues,
        startDate,
        endDate,
      };

      this.appointmentsEntity.post(payload);
    } else {
      this.showFormErrors();
    }
  };

  onPractionerChange = ({ value: practitionerId }) => {
    // Load Availabilities
    this.setState({ isAvailabilitiesLoading: true }, () => {
      this.availabilitiesEntity.get({ practitionerId });
    });
  };

  onAvailabilitiesReceived = (data) => {
    // Reset the Field
    this.setFieldValue('availabilities', '', () => {
      const availabilities = [];

      data.forEach((item) =>
        availabilities.push({
          ...item,
          formattedDate: formatDateRange({
            from: new Date(item.startDate),
            to: new Date(item.endDate),
          }),
        }),
      );

      this.setState({
        availabilities,
        startDate: '',
        endDate: '',
        isAvailabilitiesLoading: false,
      });
    });
  };

  onAvailabilitiesChange = (_, option) => {
    const { startDate, endDate } = option;
    // start + endDate
    this.setState({ startDate, endDate });
  };

  onAppointmentPosted = () => {
    this.resetFormValues(() => {
      this.hideFormErrors(() => {
        this.props.onReserveAppointment();
      });
    });
  };

  generateOption = (option) => {
    return (
      <ListItem style={{ padding: 0 }}>
        <ListItemText
          primary={`${option.firstName} ${option.lastName}`}
          {...(option.speciality && {
            secondary: `speciality: ${option.speciality}`,
          })}
        />
      </ListItem>
    );
  };

  render() {
    const { availabilities, isAvailabilitiesLoading } = this.state;
    // Get the fields
    const { LookupSelectField, StaticLookupSelectField } = this;

    return (
      <React.Fragment>
        {/* Availabilities Entity */}
        <Entity
          storeId="Availabilities-Create-Form"
          entityRef={(ref) => (this.availabilitiesEntity = ref)}
          onEntityReceived={this.onAvailabilitiesReceived}
        />
        {/* Form Entity */}
        <Entity
          storeId="Appointments-reservation"
          entityRef={(ref) => (this.appointmentsEntity = ref)}
          onEntityPosted={() => this.onAppointmentPosted()}
          render={(store) => (
            <Paper elevation={3} className="appointment-form">
              <FormLayout loading={store.loading || isAvailabilitiesLoading}>
                <FormItem md={6} lg={4} xl={4}>
                  <LookupSelectField
                    name="patientId"
                    label="patients"
                    lookup="patients"
                    asCallbackOptionLabel={this.generateOption}
                  />
                </FormItem>

                <FormItem md={6} lg={4} xl={4}>
                  <LookupSelectField
                    name="practitionerId"
                    label="practitioners"
                    lookup="practitioners"
                    asCallbackOptionLabel={this.generateOption}
                    onChange={this.onPractionerChange}
                  />
                </FormItem>

                <FormItem md={6} lg={4} xl={4}>
                  <StaticLookupSelectField
                    name="availabilities"
                    label="practitioner availabilities"
                    lookup={availabilities}
                    optionLabel="formattedDate"
                    onChange={this.onAvailabilitiesChange}
                  />
                </FormItem>
                {/* Actions */}
                <FormItem fullWidth>
                  <FormActions
                    actions={this.state.actions}
                    validationMessage={this.state.formErrorMessage}
                  />
                </FormItem>
              </FormLayout>
            </Paper>
          )}
        />
      </React.Fragment>
    );
  }
}

AppointmentForm.propTypes = {
  readOnlyMode: PropTypes.bool,
  onReserveAppointment: PropTypes.func,
};

AppointmentForm.defaultProps = {
  readOnlyMode: false,
  onReserveAppointment() {},
};

export default AppointmentForm;
