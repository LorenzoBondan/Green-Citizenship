import { DNotification } from '../../models/notification';
import './styles.css';

type Props = {
  notification: DNotification;
  onClick: () => void;
};

export default function NotificationRow({ notification, onClick }: Props) {
  return (
    <div
      className={`notification-row ${notification.isRead ? 'read' : 'unread'}`}
      onClick={onClick}
    >
      <p>{notification.text}</p>
      <span>{new Date(notification.date).toLocaleString()}</span>
    </div>
  );
}
