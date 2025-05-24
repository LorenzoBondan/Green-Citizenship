import { useState, useContext } from 'react';
import './styles.css';
import avatarPlaceHolder from '../../assets/avatar-placeholder.jpg';
import { formatLocalDateTime } from '../../utils/formatters';
import { DComment } from '../../models/comment';
import { DUser } from '../../models/user';
import * as commentService from '../../services/commentService';
import * as likeService from '../../services/likeService';
import { AuthContext } from '../../utils/auth-context';
import DialogConfirmation from '../DialogConfirmation';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

type Props = {
    comment: DComment;
    user?: DUser;
    onDelete: Function;
}

export default function CommentCard({ comment, user, onDelete }: Props) {
    console.log(comment);
    const isPostOwner = user?.id === comment.post.author.id;
    const isOwner = user?.id === comment.user.id;
    const { user: authUser } = useContext(AuthContext);

    const [dialogConfirmationData, setDialogConfirmationData] = useState({
        visible: false,
        id: 0,
        message: "Tem certeza que deseja excluir este comentário?"
    });

    const [likes, setLikes] = useState(comment.likes);

    const isLiked = likes.some(like => like.user.id === authUser?.id);

    function handleDeleteClick(commentId: number) {
        setDialogConfirmationData({
            visible: true,
            id: commentId,
            message: "Tem certeza que deseja excluir este comentário?"
        });
    }

    function handleDialogAnswer(answer: boolean, commentId: number) {
        if (answer) {
            commentService.deleteById(commentId)
                .then(() => {
                    onDelete();
                });
        }
        setDialogConfirmationData(prev => ({ ...prev, visible: false }));
    }

    function handleLike() {
        likeService.insert({ id: 0, user: authUser!, post: null!, comment })
            .then(response => {
                setLikes(prev => [...prev, response.data]);
            });
    }

    function handleUnlike() {
        const like = likes.find(like => like.user.id === authUser?.id);
        if (like) {
            likeService.deleteById(like.id)
                .then(() => {
                    setLikes(prev => prev.filter(l => l.id !== like.id));
                });
        }
    }

    return (
        <div className="card comment-card">
            <section className="comment-card-top-container">
                <img src={avatarPlaceHolder} alt="User" className="comment-user-avatar" />
                <div className="comment-user-info">
                    <h5>{comment.user.name}</h5>
                    <p>{formatLocalDateTime(comment.date.toString())}</p>
                </div>

                {(isPostOwner || isOwner) && (
                    <div className="comment-actions">
                        <button
                            className="delete-btn"
                            onClick={() => handleDeleteClick(comment.id)}
                        >
                            Excluir
                        </button>
                    </div>
                )}
            </section>

            <section className="comment-card-content">
                <p>{comment.text}</p>
            </section>

            <section className="comment-card-footer">
                {isLiked ? (
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
                <span><strong>{likes.length}</strong></span>
            </section>

            {dialogConfirmationData.visible && (
                <DialogConfirmation
                    id={dialogConfirmationData.id}
                    message={dialogConfirmationData.message}
                    onDialogAnswer={handleDialogAnswer}
                />
            )}
        </div>
    );
}
