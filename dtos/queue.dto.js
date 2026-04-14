import * as yup from "yup";

export const joinQueueDto = yup.object({
  serviceId: yup.string().required("Service ID is required"),
});

export const createCounterDto = yup.object({
  name: yup.string().required("Counter name is required").max(100),
  serviceId: yup.string().required("Service ID is required"),
});

export const updateCounterStatusDto = yup.object({
  status: yup
    .string()
    .required("Status is required")
    .oneOf(["open", "closed", "break"]),
});

export const createAppointmentDto = yup.object({
  serviceId: yup.string().required("Service ID is required"),
  date: yup.date().required("Date is required"),
  timeSlot: yup
    .object({
      start: yup.string().required("Start time is required"),
      end: yup.string().required("End time is required"),
    })
    .required("Time slot is required"),
  purpose: yup.string().max(500).nullable(),
});

export const updateAppointmentStatusDto = yup.object({
  status: yup
    .string()
    .required("Status is required")
    .oneOf(["confirmed", "checked_in", "completed", "no_show"]),
  remarks: yup.string().max(500).nullable(),
});
