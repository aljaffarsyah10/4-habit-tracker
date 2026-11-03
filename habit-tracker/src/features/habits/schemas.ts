import { z } from "zod";

export const habitFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Habit name is required")
    .max(100, "Habit name must be 100 characters or less"),
  description: z
    .string()
    .trim()
    .max(500, "Description must be 500 characters or less")
    .optional()
    .nullable(),
  frequency: z.enum(["DAILY", "WEEKLY"], {
    error: "Frequency must be either DAILY or WEEKLY",
  }),
  scheduledDays: z
    .array(z.number().int().min(0).max(6))
    .min(1, "Please select at least one day"),
  color: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Please select a valid color")
    .default("#3b82f6"),
});

export type HabitFormValues = z.infer<typeof habitFormSchema>;

