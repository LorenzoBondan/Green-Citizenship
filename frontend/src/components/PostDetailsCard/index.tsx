import './styles.css';
import { MdAutorenew, MdCancel, MdCheckCircle, MdOutlineHistory } from "react-icons/md";
import { DPost } from "../../models/post"
import { DStatusEnum } from "../../models/enums/statusEnum";
import { formatLocalDateTime } from "../../utils/formatters";
import { hasAnyRoles } from '../../services/authService';
import { useState } from 'react';
import * as postService from '../../services/postService';
import FormSelect from '../FormSelect';

type Props = {
    post: DPost;
    isEditable: boolean;
    onEdit: Function;
}

export default function PostDetailsCard({post, isEditable, onEdit}: Props) {

    const statusIcons: Record<string, JSX.Element> = {
        IN_REVISION: <MdOutlineHistory className="status-icon in-revision" title="In Revision" />,
        IN_PROGRESS: <MdAutorenew className="status-icon in-progress" title="In Progress" />,
        COMPLETED: <MdCheckCircle className="status-icon completed" title="Completed" />,
        CANCELED: <MdCancel className="status-icon canceled" title="Canceled" />
    };

    /* 
        quando for editável é possível alterar o status do Post 
        na tela de início, não será editável
        na tela de admin, será editável, para aprovar ou reprovar um Post
    */
    
    const [selectedStatus, setSelectedStatus] = useState(post.status);
    const [isLoading, setIsLoading] = useState(false);
    
    const handleStatusChange = (option: any) => {
        if (!option || option.value === selectedStatus) return;

        setIsLoading(true);
        postService.updateStatus(post.id, option.value)
            .then(() => {
                setSelectedStatus(option.value);
                onEdit();
            })
            .finally(() => setIsLoading(false));
    };

    const statusOptions = Object.values(DStatusEnum).map((item) => ({
        value: item.name,
        label: item.label,
    }));

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
                {!isEditable && hasAnyRoles(['ROLE_ADMIN']) && 
                    <div className='post-details-card-admin-section'>
                        <label htmlFor="status">Alterar Status</label>
                        <FormSelect
                            name="status"
                            className="form-control form-select-container"
                            options={statusOptions}
                            value={statusOptions.find(opt => opt.value === selectedStatus)}
                            onChange={handleStatusChange}
                            isDisabled={isLoading}
                        />
                    </div>
                }
            </div>
            
        </div>
    );
}