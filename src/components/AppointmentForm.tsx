import React, { useState, useEffect, useMemo } from 'react';
import { FormLayout, FormItem } from './Form';
import { StaticLookupSelect } from './Form/Controls';
import Entity from './Entity';

const AppointmentForm = () => {
  const [timeSlotsEntity, setEntityRef] = useState(null);

  useEffect(() => {
    timeSlotsEntity?.get();
  }, []);
  // const;
  return (
    <Entity
      storeId="Time-Slots"
      entityRef={(ref) => setEntityRef(ref)}
      render={(store) => (
        <FormLayout loading={store.loading}>
          <FormItem>
            <StaticLookupSelect label="Name" />
          </FormItem>
          <FormItem>2</FormItem>
          <FormItem>3</FormItem>
        </FormLayout>
      )}
    />
  );
};

export default AppointmentForm;
