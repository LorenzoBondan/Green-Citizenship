import { useContext, useEffect, useState } from "react";
import "./styles.css";
import * as notificationService from '../../../services/notificationService';
import * as userAttachmentService from '../../../services/userAttachmentService';
import { FaBell, FaUserCircle } from "react-icons/fa";
import { AuthContext } from "../../../utils/auth-context";
import { DNotification } from "../../../models/notification";

export default function Profile() {

  const {user} = useContext(AuthContext);

  const [notifications, setNotifications] = useState<DNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentName, setAttachmentName] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

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

  useEffect(() => {
    if (user?.userAttachment?.attachment?.binary?.bytes) {
      const base64 = user.userAttachment.attachment.binary.bytes;
      const mimeType = /*user.userAttachment.attachment.mimeType || */"image/png";
      setPreviewUrl(`data:${mimeType};base64,${base64}`);
    }
  }, [user]);

  useEffect(() => {
    if (attachmentFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(attachmentFile);
    }
  }, [attachmentFile]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    if (file && file.size > MAX_FILE_SIZE) {
      setFileError("O arquivo é muito grande. O tamanho máximo permitido é 1MB.");
      setAttachmentFile(null);
      return;
    }
    setFileError(null);
    setAttachmentFile(file);
    if (file) setAttachmentName(file.name);
  }

  function handleSubmit(event: React.FormEvent) {
  event.preventDefault();

  if (!user) return;

  if (!attachmentFile) {
    alert("Selecione uma imagem para enviar.");
    return;
  }

  const userHasAttachment = !!user.userAttachment?.id;

  const handleSuccess = () => {
    alert("Imagem do perfil atualizada com sucesso!");
    // aqui você pode querer atualizar o contexto ou recarregar o usuário
  };

  const handleError = () => {
    alert("Falha ao enviar a imagem do perfil.");
  };

  if (userHasAttachment) {
    userAttachmentService
      .update(user.userAttachment.id, user.id, attachmentFile, attachmentName)
      .then(handleSuccess)
      .catch(handleError);
    } else {
      userAttachmentService
        .insert(user.id, attachmentFile, attachmentName)
        .then(handleSuccess)
        .catch(handleError);
    }
  }

  return (
    <div className="profile-container">
      <div className="profile-card card">
        <div className="profile-header">
          {previewUrl ? (
            <img src={previewUrl} alt="Foto de perfil" className="profile-avatar" />
          ) : (
            <div className="profile-avatar-placeholder" />
          )}
          <div className="profile-info">
            <h2 className="profile-name">{user?.name}</h2>
            <p className="profile-email">{user?.email}</p>
          </div>
        </div>

        <div className="profile-section">
          <h3>Atualizar Foto de Perfil</h3>
          <form onSubmit={handleSubmit} className="profile-image-form">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="profile-file-input"
            />
            {fileError && <p className="form-error">{fileError}</p>}

            <button type="submit" className="btn btn-primary mt20">
              Salvar Foto
            </button>
          </form>
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
