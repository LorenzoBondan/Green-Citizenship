import { useNavigate, Link } from "react-router-dom";
import { DStatusEnum } from "../../models/enums/statusEnum";
import { DPost } from "../../models/post";
import { formatLocalDateTime } from "../../utils/formatters";
import './styles.css';
import * as postService from '../../services/postService';
import { FaComment, FaHeart, FaRegHeart } from "react-icons/fa";
import {
    MdOutlineHistory,
    MdAutorenew,
    MdCheckCircle,
    MdCancel,
    MdErrorOutline
} from "react-icons/md";
import { DUser } from "../../models/user";
import { useEffect, useState } from "react";
import DialogInfo from "../DialogInfo";
import DialogConfirmation from "../DialogConfirmation";
import FormLabel from "../FormLabel";
import FormSelect from "../FormSelect";

type Props = {
    post: DPost;
    user: DUser;
    isAdminPage: boolean;
    onDelete: Function;
}

export default function PostCard({ post, user, isAdminPage, onDelete }: Props) {
    const isOwner = user?.id === post.author.id;
    const navigate = useNavigate();
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [likes, setLikes] = useState(post.likes);

    useEffect(() => {
        if (post?.postAttachment?.attachment?.binary?.bytes) {
            const base64 = post.postAttachment.attachment.binary.bytes;
            const mimeType = "image/png";
            setPreviewUrl(`data:${mimeType};base64,${base64}`);
        }
    }, [post]);

    const isProjectLiked = likes.some(like => like.user.id === user?.id);

    const statusIcons: Record<string, JSX.Element> = {
        IN_REVISION: <MdOutlineHistory className="status-icon in-revision" title="In Revision" />,
        IN_PROGRESS: <MdAutorenew className="status-icon in-progress" title="In Progress" />,
        COMPLETED: <MdCheckCircle className="status-icon completed" title="Completed" />,
        CANCELED: <MdCancel className="status-icon canceled" title="Canceled" />
    };

    const [dialogInfoData, setDialogInfoData] = useState({
        visible: false,
        message: "Sucesso!"
    });

    const [dialogConfirmationData, setDialogConfirmationData] = useState({
        visible: false,
        id: 0,
        message: "Você tem certeza?"
    });

    function handleDialogInfoClose() {
        setDialogInfoData({ ...dialogInfoData, visible: false });
    }

    function handleDeleteClick(postId: number) {
        setDialogConfirmationData({ ...dialogConfirmationData, id: postId, visible: true });
    }

    function handleDialogConfirmationAnswer(answer: boolean, postId: number) {
        if (answer) {
            postService.deleteById(postId)
                .then(() => {
                    onDelete();
                })
                .catch(error => {
                    setDialogInfoData({
                        visible: true,
                        message: error.response.data.error
                    });
                });
        }

        setDialogConfirmationData({ ...dialogConfirmationData, visible: false });
    }

    function handleCardClick(e: React.MouseEvent) {
        const target = e.target as HTMLElement;
        
        if (target.closest('button') || target.closest('a')) {
            return;
        }

        if (!isAdminPage) {
            navigate(`/posts/${post.id}`);
        }
    }

    const [formData, setFormData] = useState({
    status: {
        value: post.status,
        message: ""
    }
    });

    const statusOptions = Object.values(DStatusEnum).map((item) => ({
        value: item.name,
        label: item.label,
    }));

    function handleStatusChange(selectedOption: any) {
        setFormData((prevData) => ({
            ...prevData,
            status: {
                value: selectedOption.value,
                message: ""
            }
        }));

        postService.updateStatus(post.id, selectedOption.value)
            .then(() => {
                setDialogInfoData({
                    visible: true,
                    message: "Status atualizado com sucesso!"
                });
                onDelete();
            })
            .catch((error) => {
                setDialogInfoData({
                    visible: true,
                    message: error.response?.data?.error || "Erro ao atualizar status."
                });
        });
    }

    return (
        <div
            className={`card post-card ${isAdminPage ? 'no-hover' : ''}`}
            onClick={handleCardClick}
        >
            <div className="post-header">
                <div className="post-title">
                    <h2>{post.title}</h2>
                    {post.isUrgent && <MdErrorOutline className="urgent-icon" title="Urgente" />}
                </div>
                <span className={`status-badge status-${post.status.toLowerCase()}`}>
                    {statusIcons[post.status]}
                    {DStatusEnum[post.status].label}
                </span>
            </div>

            <p className="post-description">
                {post.description.length > 120
                    ? post.description.slice(0, 120) + "..."
                    : post.description}
            </p>

            <div className="post-middle-container">
                <span className="post-author">por {post.author.name}</span>
                <span className="post-category">{post.category.name}</span>
            </div>

            {previewUrl && (
                <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
                    <img
                        src={previewUrl}
                        alt={post.postAttachment?.attachment?.name || "Imagem da publicação"}
                        className="form-image-preview"
                        style={{
                            maxWidth: "300px",
                            borderRadius: "8px",
                            objectFit: "cover"
                        }}
                    />
                </div>
            )}

            <div className="post-footer">
                {!isAdminPage ? (
                    <>
                        <span className="post-date">{formatLocalDateTime(post.date.toString())}</span>
                        <div className="post-interactions">
                            <span>
                                {isProjectLiked ? (
                                    <FaHeart
                                        className="icon like-icon"
                                        style={{ color: 'red', cursor: 'pointer' }}
                                        title="Descurtir"
                                    />
                                    ) : (
                                    <FaRegHeart
                                        className="icon like-icon"
                                        style={{ color: 'grey', cursor: 'pointer' }}
                                        title="Curtir"
                                    />
                                )}
                                <strong>{likes.length}</strong>
                            </span>
                            <span><FaComment className="icon" style={{ color: "grey" }} /> {post.comments.length}</span>
                        </div>
                        {isOwner &&
                            <div className="post-card-buttons-container mt20">
                                <button className="btn btn-primary">
                                    <Link to={`/postform/${post.id}`}>Editar</Link>
                                </button>
                                <button
                                    className="btn btn-inverse"
                                    onClick={() => handleDeleteClick(post.id)}
                                >
                                    Excluir
                                </button>
                            </div>
                        }
                    </>
                ) : (
                    <div className="post-card-buttons-container mt20">
                        <div className="w100">
                            <FormLabel text="Alterar status" />
                            <FormSelect
                                className="form-control form-select-container"
                                options={statusOptions}
                                value={formData.status.value}
                                placeholder="Selecione o status"
                                onChange={handleStatusChange}
                            />
                            <div className="form-error">{formData.status.message}</div>
                        </div>
                    </div>
                )}
            </div>

            {dialogInfoData.visible &&
                <DialogInfo
                    message={dialogInfoData.message}
                    onDialogClose={handleDialogInfoClose}
                />
            }

            {dialogConfirmationData.visible &&
                <DialogConfirmation
                    id={dialogConfirmationData.id}
                    message={dialogConfirmationData.message}
                    onDialogAnswer={handleDialogConfirmationAnswer}
                />
            }
        </div>
    );
}
