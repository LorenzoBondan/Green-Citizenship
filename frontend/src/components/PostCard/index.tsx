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
import { useState } from "react";
import DialogInfo from "../DialogInfo";
import DialogConfirmation from "../DialogConfirmation";

type Props = {
    post: DPost;
    user: DUser;
    isAdminPage: boolean;
    onDelete: Function;
}

export default function PostCard({ post, user, isAdminPage, onDelete }: Props) {
    const isOwner = user?.id === post.author.id;
    const navigate = useNavigate();

    const [likes, setLikes] = useState(post.likes);

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

    function handleUpdateStatus(status: "COMPLETED" | "CANCELED") {
        postService.updateStatus(post.id, status)
            .then(() => {
            setDialogInfoData({
                visible: true,
                message: `Publicação ${status === "COMPLETED" ? "aprovada" : "reprovada"} com sucesso!`
            });
            onDelete();
            })
            .catch(error => {
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
                        <button
                            className="btn btn-primary"
                            onClick={() => handleUpdateStatus("COMPLETED")}
                        >
                            Aprovar
                        </button>
                        <button
                            className="btn btn-inverse"
                            onClick={() => handleUpdateStatus("CANCELED")}
                        >
                            Reprovar
                        </button>
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
