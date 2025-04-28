import { Link } from "react-router-dom";
import { DStatusEnum } from "../../models/enums/statusEnum";
import { DPost } from "../../models/post";
import { formatLocalDateTime } from "../../utils/formatters";
import './styles.css';
import { FaComment, FaHeart } from "react-icons/fa";
import {
    MdOutlineHistory,
    MdAutorenew,
    MdCheckCircle,
    MdCancel,
    MdErrorOutline
} from "react-icons/md";
import { DUser } from "../../models/user";

type Props = {
    post: DPost;
    user: DUser;
}

export default function PostCard({post, user} : Props) {

    const isOwner = user?.id === post.author.id;

    const statusIcons: Record<string, JSX.Element> = {
        IN_REVISION: <MdOutlineHistory className="status-icon in-revision" title="In Revision" />,
        IN_PROGRESS: <MdAutorenew className="status-icon in-progress" title="In Progress" />,
        COMPLETED: <MdCheckCircle className="status-icon completed" title="Completed" />,
        CANCELED: <MdCancel className="status-icon canceled" title="Canceled" />
    };

    return(
        <Link to={`/posts/${post.id}`}>
            <div className="card post-card">
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
                    <span className="post-date">{formatLocalDateTime(post.date.toString())}</span>
                    <div className="post-interactions">
                        <span><FaHeart className="icon" style={{color:"red"}} /> {post.likes.length}</span>
                        <span><FaComment className="icon" style={{color:"grey"}}/> {post.comments.length}</span>
                    </div>
                    {isOwner && 
                        <div className="btn btn-primary">
                            <Link to={`/postform/${post.id}`}>
                                Editar
                            </Link>
                        </div>
                    }
                </div>
            </div>
        </Link>
    );
}