import { useContext, useEffect, useState } from 'react';
import { DNotification } from '../../models/notification';
import * as notificationService from '../../services/notificationService';
import NotificationRow from '../NotificationRow';
import './styles.css';
import { AuthContext } from '../../utils/auth-context';
import { BsBellFill } from 'react-icons/bs';

export default function NotificationList() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState<DNotification[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (user) {
      const userId = Number(user.id);
      notificationService.findAllByUserId(userId)
        .then(response => {
          setNotifications(response.data.content);
        });
    }
  }, [user]);

  function handleToggle() {
    setVisible(!visible);
  }

  function handleRead(notificationId: number) {
    notificationService.updateIsRead(notificationId)
      .then(() => {
        setNotifications(prev =>
          prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        );
      });
  }

  return (
    <div className="notification-wrapper">
      <div className="notification-icon" onClick={handleToggle}>
        <BsBellFill size={22} color="#ffffff" />
      </div>

      {visible && (
        <div className="notification-list">
          {notifications.length === 0 && <p className="empty">Sem notificações</p>}
          {notifications.map(notification => (
            <NotificationRow
              key={notification.id}
              notification={notification}
              onClick={() => handleRead(notification.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
