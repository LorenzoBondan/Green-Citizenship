import { useNavigate, useParams } from 'react-router-dom';
import './styles.css';
import { useEffect, useState } from 'react';
import { DPost } from '../../../models/post';
import * as postService from '../../../services/postService';
import { Link } from 'react-router-dom';
import ButtonInverse from '../../../components/ButtonInverse';
import PostDetailsCard from '../../../components/PostDetailsCard';

export default function PostDetails() {

    const params = useParams();

    const navigate = useNavigate();
  
    const [post, setPost] = useState<DPost>();

    useEffect(() => {
      findPostById();
    }, [params.postId]);

    const findPostById = () => {
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
    };

    return(
      <main>
        <section id="post-details-section" className="container">
          {post && <PostDetailsCard post={post} key={post.id}/> }
          <div className="btn-page-container">
            
            <Link to="/">
              <ButtonInverse text="Home" />
            </Link>
          </div>
        </section>
      </main>
    );
}