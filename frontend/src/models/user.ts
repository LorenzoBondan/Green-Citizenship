import { DNotification } from "./notification";
import { DUserAttachment } from "./userAttachment";

export type DUser = {
  id: number;
  name: string;
  email: string;
  userAttachment: DUserAttachment;

  notifications: DNotification[];
};
