import { addEmailToQueue } from '../../queues/emailQueue';

export const queueService = {
  sendEmail: (data: { to: string; subject: string; html: string; text?: string }) =>
    addEmailToQueue(data),

  // TODO: Add domain-specific queue jobs here
  // Example:
  // sendSms: (data: { to: string; message: string }) => addSmsToQueue(data),
  // scheduleReminder: (data: ReminderJobData) => addReminderToQueue(data),
};
