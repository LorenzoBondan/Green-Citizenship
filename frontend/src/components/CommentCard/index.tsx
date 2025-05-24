import { DComment } from '../../models/comment';
import * as commentService from '../../services/commentService';
import { DUser } from '../../models/user';
import './styles.css';
import { formatLocalDateTime } from '../../utils/formatters';
import avatarPlaceHolder from '../../assets/avatar-placeholder.jpg';
import { useState } from 'react';
import DialogConfirmation from '../DialogConfirmation';

type Props = {
    comment: DComment;
    user?: DUser;
    onDelete: Function;
}

export default function CommentCard({ comment, user, onDelete }: Props) {

    const isOwner = user?.id === comment.user.id;

    const [dialogConfirmationData, setDialogConfirmationData] = useState({
        visible: false,
        id: 0,
        message: "Tem certeza que deseja excluir este comentário?"
    });

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

    return (
        <div className="card comment-card">
            <section className="comment-card-top-container">
                <img src={avatarPlaceHolder} alt="User" className="comment-user-avatar" />
                <div className="comment-user-info">
                    <h5>{comment.user.name}</h5>
                    <p>{formatLocalDateTime(comment.date.toString())}</p>
                </div>
                {isOwner && (
                    <div className="comment-actions">
                        <button className="delete-btn" onClick={() => handleDeleteClick(comment.id)}>Excluir</button>
                    </div>
                )}
            </section>

            <section className="comment-card-content">
                <p>{comment.text}</p>
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
