import { z } from 'zod';

export const downloadCertificateSchema = z.object({
  certificateId: z.string().min(1, 'Certificate ID is required')
});
