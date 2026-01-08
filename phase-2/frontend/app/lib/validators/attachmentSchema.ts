import * as yup from "yup";
import {
  MAX_FILE_SIZE,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_PDF_TYPES,
  ALLOWED_TEXT_TYPES,
  getFileType,
} from "../../types/attachment";

const ALLOWED_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_PDF_TYPES,
  ...ALLOWED_TEXT_TYPES,
];

export const attachmentSchema = yup.object({
  files: yup
    .array()
    .of(yup.mixed<File>().required())
    .min(1, "Please select at least one file")
    .test("file-type", "Invalid file type. Only images, PDFs, and text files are allowed.", (files) => {
      if (!files || files.length === 0) return true;
      return files.every((file) => {
        if (!(file instanceof File)) return false;
        return ALLOWED_TYPES.includes(file.type);
      });
    })
    .test("file-size", `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)} MB`, (files) => {
      if (!files || files.length === 0) return true;
      return files.every((file) => {
        if (!(file instanceof File)) return false;
        return file.size <= MAX_FILE_SIZE;
      });
    }),
});

export type AttachmentFormValues = yup.InferType<typeof attachmentSchema>;


