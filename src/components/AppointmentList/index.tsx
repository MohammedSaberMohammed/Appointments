import React, { useState, useCallback } from 'react';
// Services
import { formatDateRange } from 'utils/date';
// MUI
import Button from '@material-ui/core/Button';

// Components
import Card from 'components/MediaCard';
import AppointmentDialog from './AppointmentDialog';
import { FormLayout, FormItem } from 'components/Form';
import { LabelAndValue, LookupString } from 'components/Form/Controls';

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
  appointments: any[];
  refreshList: () => void;
  entityStore?: Store;
};

const AppointmentList = (props: Props) => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const { appointments, entityStore, refreshList } = props;

  const renderReadOnlyForm = (appointment) => {
    const { practitionerId, patientId, startDate, endDate } = appointment;

    return (
      <FormLayout>
        <FormItem md={12} lg={6} xl={6}>
          <LabelAndValue
            label={'Practitioner'}
            value={
              <LookupString value={practitionerId} lookup="practitioners" />
            }
          />
        </FormItem>

        <FormItem md={12} lg={6} xl={6}>
          <LabelAndValue
            label={'Patient'}
            value={<LookupString value={patientId} lookup="patients" />}
          />
        </FormItem>

        <FormItem fullWidth>
          <LabelAndValue
            label={'Date'}
            value={formatDateRange({
              from: new Date(startDate),
              to: new Date(endDate),
            })}
          />
        </FormItem>

        <FormItem fullWidth>
          <Button
            onClick={() => onEditAppointment(appointment)}
            color={'primary'}
            variant={'outlined'}
            fullWidth
          >
            {'Edit'}
          </Button>
        </FormItem>
      </FormLayout>
    );
  };

  const onEditAppointment = useCallback(
    (appointment) => {
      setSelectedAppointment(appointment);
    },
    [setSelectedAppointment],
  );

  const onCloseDialog = useCallback(() => {
    setSelectedAppointment(null);
  }, [setSelectedAppointment]);

  const onCancelAndRefetch = () => {
    onCloseDialog();
    refreshList();
  };

  return (
    <React.Fragment>
      {/* Render Preview Dialog */}
      {selectedAppointment && (
        <AppointmentDialog
          appointment={selectedAppointment}
          onCloseDialog={onCloseDialog}
          cancelAndRefetch={onCancelAndRefetch}
        />
      )}

      <FormLayout loading={entityStore.loading}>
        {appointments.map((appointment) => (
          <FormItem key={appointment.id} lg={4} xl={4}>
            <Card bodyContent={renderReadOnlyForm(appointment)} />
          </FormItem>
        ))}
      </FormLayout>
    </React.Fragment>
  );
};

export default AppointmentList;
