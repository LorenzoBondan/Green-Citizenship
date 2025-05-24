import { useContext, useEffect, useState } from "react";
import "./styles.css";
import * as notificationService from '../../../services/notificationService';
import { FaBell, FaUserCircle } from "react-icons/fa";
import { AuthContext } from "../../../utils/auth-context";
import { DNotification } from "../../../models/notification";

export default function Profile() {

  const {user} = useContext(AuthContext);

  const [notifications, setNotifications] = useState<DNotification[]>([]);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        setLoading(true);

        notificationService
            .findAllByUserId(user.id)
            .then((response) => {
            setNotifications(response.data.content);
            })
            .catch((error) => {
            console.error("Erro ao buscar notificações:", error);
            })
            .finally(() => {
            setLoading(false);
            });
    }, [user]);

  return (
    <div className="profile-container">
      <div className="profile-card card">
        <div className="profile-header">
          {user?.userAttachment ? (
            <img
              src=""
              alt="Foto de perfil"
              className="profile-avatar"
            />
          ) : (
            <FaUserCircle className="profile-avatar-placeholder" />
          )}
          <div>
            <h2 className="profile-name">{user?.name}</h2>
            <p className="profile-email">{user?.email}</p>
          </div>
        </div>

        <div className="profile-section">
          <h3>Funções</h3>
          <ul className="profile-roles">
            {user?.roles.map((role) => (
              <li key={role.id} className="profile-role-item">
                {role.authority}
              </li>
            ))}
          </ul>
        </div>

        <div className="profile-section">
          <h3>
            <FaBell className="icon-inline" /> Notificações Recentes
          </h3>
          {loading ? (
            <p>Carregando notificações...</p>
          ) : notifications.length === 0 ? (
            <p>Você não tem notificações.</p>
          ) : (
            <ul className="profile-notifications">
              {notifications.slice(0, 5).map((notification) => (
                <li key={notification.id} className="notification-item">
                  {notification.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
