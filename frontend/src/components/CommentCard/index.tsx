import { DComment } from '../../models/comment';
import * as commentService from '../../services/commentService';
import { DUser } from '../../models/user';
import './styles.css';
import { formatLocalDateTime } from '../../utils/formatters';
import avatarPlaceHolder from '../../assets/avatar-placeholder.jpg';

type Props = {
    comment: DComment;
    user?: DUser;
    onEdit: Function;
    onDelete: Function;
}

export default function CommentCard({ comment, user, onEdit, onDelete }: Props) {

    const isOwner = user?.id === comment.user.id;

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
                        <button className="edit-btn">Editar</button>
                        <button className="delete-btn">Excluir</button>
                    </div>
                )}
            </section>

            <section className="comment-card-content">
                <p>{comment.text}</p>
            </section>
        </div>
    );
}
