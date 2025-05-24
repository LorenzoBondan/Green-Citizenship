import { DNotification } from "./notification";
import { DUserAttachment } from "./userAttachment";

export type DUser = {
  id: number;
  name: string;
  email: string;
  userAttachment: DUserAttachment;

  roles: DRole[];
  notifications: DNotification[];
};

export type DRole = {
  id: number;
  authority: string;
}
