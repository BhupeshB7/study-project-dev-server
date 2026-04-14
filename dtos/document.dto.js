import * as yup from "yup";

export const uploadDocumentDto = yup.object({
  name: yup.string().required("Document name is required").max(200),
  type: yup
    .string()
    .required("Document type is required")
    .oneOf([
      "id_proof",
      "address_proof",
      "academic",
      "photo",
      "certificate",
      "other",
    ]),
  fileUrl: yup.string().required("File URL is required"),
  fileId: yup.string().required("File ID is required"),
  mimeType: yup.string().nullable(),
  fileSize: yup.number().nullable(),
  serviceRequestId: yup.string().nullable(),
});

export const verifyDocumentDto = yup.object({
  action: yup
    .string()
    .required("Action is required")
    .oneOf(["verify", "reject"]),
  rejectionReason: yup.string().max(500).nullable(),
});
