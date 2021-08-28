import React from 'react';
// MUI
import Paper from '@material-ui/core/Paper';
// Services
import { isRequired } from '../Services/Validators';
import { formatDateRange } from 'utils/date';
// Components
import Entity from './Entity';
import { FormLayout, FormItem, BaseFormComponent, FormActions } from './Form';

class AppointmentForm extends BaseFormComponent {
  constructor(props) {
    super(props);

    this.initState({
      availabilities: [],
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
    this.appointmentsEntity.get({ practitionerId });
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

      this.setState({ availabilities, startDate: '', endDate: '' });
    });
  };

  onAvailabilitiesChange = (_, option) => {
    const { startDate, endDate } = option;
    // start + endDate
    this.setState({ startDate, endDate });
  };

  render() {
    const { availabilities } = this.state;
    // Get the fields
    const { LookupSelectField, StaticLookupSelectField } = this;
    console.log('formvalues', this.formValues);
    return (
      <Entity
        storeId="Appointments-reservation"
        entityRef={(ref) => (this.appointmentsEntity = ref)}
        onEntityReceived={this.onAvailabilitiesReceived}
        render={(store) => (
          <Paper elevation={3} className="appointment-form">
            <FormLayout loading={store.loading}>
              <FormItem md={6} lg={4} xl={4}>
                <LookupSelectField
                  name="patientId"
                  label="patients"
                  lookup="patients"
                  asCallbackOptionLabel={(option) =>
                    `${option.firstName} ${option.lastName}`
                  }
                />
              </FormItem>

              <FormItem md={6} lg={4} xl={4}>
                <LookupSelectField
                  name="practitionerId"
                  label="practitioners"
                  lookup="practitioners"
                  asCallbackOptionLabel={(option) =>
                    `${option.firstName} ${option.lastName}`
                  }
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
    );
  }
}

export default AppointmentForm;
