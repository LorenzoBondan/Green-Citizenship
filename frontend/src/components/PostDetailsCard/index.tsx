import './styles.css';
import { useState, useContext, useEffect } from "react";
import { FaHeart, FaRegHeart, FaComment } from "react-icons/fa";
import {
    MdAutorenew,
    MdCancel,
    MdCheckCircle,
    MdOutlineHistory
} from "react-icons/md";
import { DPost } from "../../models/post";
import { DStatusEnum } from "../../models/enums/statusEnum";
import { formatLocalDateTime } from "../../utils/formatters";
import { AuthContext } from '../../utils/auth-context';
import * as likeService from '../../services/likeService';
import avatarPlaceHolder from '../../assets/avatar-placeholder.jpg';

type Props = {
    post: DPost;
}

export default function PostDetailsCard({ post }: Props) {
    const { user } = useContext(AuthContext);
    const [likes, setLikes] = useState(post.likes);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (post?.postAttachment?.attachment?.binary?.bytes) {
            const base64 = post.postAttachment.attachment.binary.bytes;
            const mimeType = "image/png";
            setPreviewUrl(`data:${mimeType};base64,${base64}`);
        }
    }, [post]);

    const isProjectLiked = likes.some(like => like.user.id === user?.id);

    function handleLike() {
        likeService.insert({ id: 0, user: user!, post, comment: null! })
            .then(response => {
                setLikes(prev => [...prev, response.data]);
            });
    }

    function handleUnlike() {
        const like = likes.find(like => like.user.id === user?.id);
        if (like) {
            likeService.deleteById(like.id)
                .then(() => {
                    setLikes(prev => prev.filter(l => l.id !== like.id));
                });
        }
    }

    const statusIcons: Record<string, JSX.Element> = {
        IN_REVISION: <MdOutlineHistory className="status-icon in-revision" title="In Revision" />,
        IN_PROGRESS: <MdAutorenew className="status-icon in-progress" title="In Progress" />,
        COMPLETED: <MdCheckCircle className="status-icon completed" title="Completed" />,
        CANCELED: <MdCancel className="status-icon canceled" title="Canceled" />
    };

    return (
        <div className="card mb20">
            <div className="post-details-top line-bottom">
                <h2>{post.title}</h2>
                <span className={`status-badge status-${post.status.toLowerCase()}`}>
                    {statusIcons[post.status]}
                    {DStatusEnum[post.status].label}
                </span>
            </div>

            <div className="post-details-body">
                <p>{post.description}</p>

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

                <p><strong>Data de publicação:</strong> {formatLocalDateTime(post.date.toString())}</p>

                <div className="post-author-section mt20">
                    <h4>Autor</h4>
                    <div className="post-author-info">
                        {post.author.userAttachment?.attachment?.binary?.bytes ? (
                            <img
                                src={`data:image/png;base64,${post.author.userAttachment.attachment.binary.bytes}`}
                                alt="Autor"
                                className="post-author-avatar"
                            />
                        ) : (
                            <img
                                src={avatarPlaceHolder}
                                alt="User"
                                className="comment-user-avatar"
                            />
                        )}
                        <span className="post-author-name">{post.author.name}</span>
                    </div>
                </div>

                <div className="post-footer mt20">
                    <div className="post-interactions">
                        <span>
                            {isProjectLiked ? (
                                <FaHeart
                                    className="icon like-icon"
                                    style={{ color: 'red', cursor: 'pointer' }}
                                    title="Descurtir"
                                    onClick={handleUnlike}
                                />
                            ) : (
                                <FaRegHeart
                                    className="icon like-icon"
                                    style={{ color: 'grey', cursor: 'pointer' }}
                                    title="Curtir"
                                    onClick={handleLike}
                                />
                            )}
                            <strong>{likes.length}</strong>
                        </span>

                        <span>
                            <FaComment
                                className="icon comment-icon"
                                style={{ color: 'grey', marginLeft: '10px' }}
                                title="Comentários"
                            />
                            <strong>{post.comments.length}</strong>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
