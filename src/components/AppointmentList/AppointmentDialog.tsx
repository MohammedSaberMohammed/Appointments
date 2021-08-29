import React from 'react';

// Components
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { formatDateRange } from 'utils/date';

import Entity from 'components/Entity';
import { BaseFormComponent, FormLayout, FormItem } from 'components/Form';
import { LabelAndValue } from 'components/Form/Controls';

import { isRequired } from 'Services/Validators';
import { Paper } from '@material-ui/core';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class AppointmentDialog extends BaseFormComponent {
  singleAppointmentEntity;
  availabilitiesEntity;
  constructor() {
    super();

    this.initState({
      availabilities: [],
      isAvailabilitiesLoading: false,
      startDate: '',
      endDate: '',
      selectedDate: '',

      form: {
        id: {
          type: this.types.number,
        },
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
    });
  }

  componentDidMount() {
    // To trigger the initial validation for the form
    super.componentDidMount();

    const { appointment } = this.props;

    this.updateFormValues(appointment, () => {
      const selectedDate = formatDateRange({
        from: new Date(appointment.startDate),
        to: new Date(appointment.endDate),
      });

      this.setState({ selectedDate }, () => {
        this.onPractionerChange({ value: appointment.practitionerId });
      });
    });
  }

  onUpdateAppointment = () => {
    if (this.isFormValid) {
      const { startDate, endDate } = this.state;

      const payload = {
        ...this.formValues,
        startDate,
        endDate,
      };

      this.singleAppointmentEntity.put(payload);
    } else {
      this.showFormErrors();
    }
  };

  onDeleteAppointment = () => {
    const { id } = this.formValues;

    if (id) {
      this.singleAppointmentEntity.delete({ id });
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
    const { onCloseDialog, cancelAndRefetch } = this.props;
    const { selectedDate, availabilities, isAvailabilitiesLoading } =
      this.state;
    // Get the fields
    const { LookupSelectField, StaticLookupSelectField } = this;

    return (
      <React.Fragment>
        {/* Availabilities Entity */}
        <Entity
          storeId="Availabilities-Updation-Form"
          entityRef={(ref) => (this.availabilitiesEntity = ref)}
          onEntityReceived={this.onAvailabilitiesReceived}
        />

        <Entity
          storeId="Single-Appointment"
          entityRef={(ref) => (this.singleAppointmentEntity = ref)}
          onEntityDidPut={cancelAndRefetch}
          onEntityDeleted={cancelAndRefetch}
          render={(store) => (
            <Dialog
              open={true}
              fullWidth
              fullScreen
              maxWidth={'md'}
              onClose={onCloseDialog}
              TransitionComponent={Transition}
            >
              <AppBar>
                <Toolbar className={'dialog-toolbar'}>
                  <Typography variant="h6" className={'title'}>
                    {'Edit the Appointment'}
                  </Typography>
                  <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => this.props.onCloseDialog()}
                    aria-label="Close"
                  >
                    <CloseIcon />
                  </IconButton>
                </Toolbar>
              </AppBar>

              <FormLayout
                className="form-dialog-layout"
                loading={store.loading || isAvailabilitiesLoading}
              >
                <FormItem sm={8} md={8} lg={8} xl={8}>
                  <FormLayout>
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
                    <FormItem md={6} lg={4} xl={4}>
                      <LabelAndValue
                        label="Current Selected Date"
                        value={selectedDate}
                      />
                    </FormItem>
                  </FormLayout>
                </FormItem>
                {/* Actions */}
                <FormItem sm={4} md={4} lg={4} xl={4}>
                  <Paper className="dialog-action-wrapper">
                    <Button
                      fullWidth
                      variant={'contained'}
                      color="primary"
                      onClick={this.onUpdateAppointment}
                    >
                      Update
                    </Button>
                  </Paper>

                  <Paper className="dialog-action-wrapper">
                    <Button
                      fullWidth
                      variant={'outlined'}
                      color="secondary"
                      onClick={this.onDeleteAppointment}
                    >
                      Delete
                    </Button>
                  </Paper>

                  <Paper className="dialog-action-wrapper">
                    <Button
                      fullWidth
                      variant={'outlined'}
                      color="secondary"
                      // className="theme_secondary_button"
                      onClick={onCloseDialog}
                    >
                      Cancel
                    </Button>
                  </Paper>
                </FormItem>
              </FormLayout>
            </Dialog>
          )}
        />
      </React.Fragment>
    );
  }
}

export default AppointmentDialog;
