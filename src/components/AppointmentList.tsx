import React from 'react';
// Services
import { formatDateRange } from 'utils/date';
// Components
import Card from './MediaCard';
import { FormLayout, FormItem } from './Form';
import { LabelAndValue, LookupString } from './Form/Controls';

type Props = {
  appointments: any[];
  entityStore?: Record<string, unknown>;
};

const AppointmentList = (props: Props) => {
  const { appointments, entityStore } = props;

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
      </FormLayout>
    );
  };

  return (
    <React.Fragment>
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
