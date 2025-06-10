import { useNavigate, useParams } from 'react-router-dom';
import './styles.css';
import { useCallback, useContext, useEffect, useState } from 'react';
import { DPost } from '../../../models/post';
import * as postService from '../../../services/postService';
import { Link } from 'react-router-dom';
import PostDetailsCard from '../../../components/PostDetailsCard';
import CommentForm from '../../../components/CommentForm';
import { isAuthenticated } from '../../../services/authService';
import CommentCard from '../../../components/CommentCard';
import { AuthContext } from '../../../utils/auth-context';

export default function PostDetails() {

    const params = useParams();

    const navigate = useNavigate();
  
    const [post, setPost] = useState<DPost>();
    const { user } = useContext(AuthContext);

    useEffect(() => {
      findPostById();
    }, [params.postId]);

    const findPostById = useCallback(() => {
      const postId = Number(params.postId);
      if (!isNaN(postId)) {
        postService
          .findById(postId)
          .then((response) => {
            setPost(response.data);
          })
          .catch(() => {
            navigate("/"); 
          });
      } else {
        navigate("/");
      }
    }, [params.postId, navigate]);

    return(
      <main>
        <section id="post-details-section" className="container">
          {post && <PostDetailsCard post={post}/> }

          <div className="comments-grid mb20 mt20">
            {post?.comments.map(comment => (
              <CommentCard key={comment.id} comment={comment} user={user} onDelete={findPostById} />
            ))}
          </div>

          {isAuthenticated() ? 
            <section>
              {post && <CommentForm post={post} onButtonClick={findPostById} />}
            </section>
            : 
            <Link to="/login"><p style={{marginBottom:"20px", color:"blue"}}>Faça login para comentar</p></Link>
          }
        </section>
      </main>
    );
}