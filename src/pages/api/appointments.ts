import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'prisma/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET':
      const appointments = await prisma.appointment.findMany();
      res.status(200).json(appointments);
      break;
    case 'POST': {
      const { patientId, practitionerId, startDate, endDate } = req.body;
      const appointment = await prisma.appointment.create({
        data: {
          patientId: parseInt(patientId),
          practitionerId: parseInt(practitionerId),
          startDate: startDate,
          endDate: endDate,
        },
      });
      res.status(200).json(appointment);
      break;
    }
    case 'DELETE': {
      const { id } = req.body;
      const deletedAppointment = await prisma.appointment.delete({
        where: {
          id,
        },
      });
      res.status(200).json(deletedAppointment);
      break;
    }
  }
};
