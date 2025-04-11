import './styles.css';
import { MdAutorenew, MdCancel, MdCheckCircle, MdOutlineHistory } from "react-icons/md";
import { DPost } from "../../models/post"
import { DStatusEnum } from "../../models/enums/statusEnum";
import { formatLocalDateTime } from "../../utils/formatters";

type Props = {
    post: DPost;
}

export default function PostDetailsCard({post}: Props) {

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
                <p><strong>Data de publicação:</strong> {formatLocalDateTime(post.date.toString())}</p>
                <div className="post-footer">
                    <div className="post-interactions">
                        <span>
                            <strong>{post.likes.length}</strong> {post.likes.length === 1 ? ' curtida' : ' curtidas'}
                        </span>
                        <span>
                            <strong>{post.comments.length}</strong> {post.comments.length === 1 ? ' comentário' : ' comentários'}
                        </span>
                    </div>
                </div>
            </div>
            
        </div>
    );
}