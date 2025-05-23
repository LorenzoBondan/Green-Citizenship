import './styles.css';
import * as postService from '../../../services/postService';
import { useContext, useEffect, useState } from 'react';
import SearchBar from '../../../components/SearchBar';
import ButtonNextPage from '../../../components/ButtonNextPage';
import { MdClear } from "react-icons/md";
import { DPost } from '../../../models/post';
import PostCard from '../../../components/PostCard';
import { DStatusEnum } from '../../../models/enums/statusEnum';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../utils/auth-context';

type QueryParams = {
    page: number;
    title: string;
    categoryId: number;
}

export default function PostCatalog() {
    const { user } = useContext(AuthContext);
    const [isLastPage, setIsLastPage] = useState(false);
    const [posts, setPosts] = useState<DPost[]>([]);
    const [queryParams, setQueryParam] = useState<QueryParams>({
        page: 0,
        title: "",
        categoryId: 0
    });

    useEffect(() => {
        const statusId = [DStatusEnum.IN_PROGRESS.value, DStatusEnum.COMPLETED.value];

        const params: any = {
            title: queryParams.title,
            page: queryParams.page,
            sort: "title,asc"
        };
    
        if (queryParams.categoryId !== 0) {
            params.categoryId = queryParams.categoryId;
        }

        postService.findAll(
            params.title,
            params.categoryId,
            statusId,
            params.page,
            undefined,
            params.sort
        ).then(response => {
            const nextPage = response.data.content;
            setPosts(prevList => (queryParams.page === 0 ? nextPage : [...prevList, ...nextPage]));
            setIsLastPage(response.data.last);
        });
    }, [queryParams]);

    function handleSearch(searchText: string) {
        setPosts([]);
        setQueryParam(prev => ({
            ...prev,
            page: 0,
            title: searchText
        }));
    }

    function handleNextPageClick() {
        setQueryParam(prev => ({
            ...prev,
            page: prev.page + 1
        }));
    }

    function updateFilters(categoryId: number) {
        setPosts([]);
        setQueryParam(prev => ({
            ...prev,
            categoryId,
            page: 0
        }));
    }

    function handleClearFilters() {
        setPosts([]);
        setQueryParam({
            page: 0,
            title: "",
            categoryId: 0
        });
    }

    return (
        <main>
            <section id="catalog-section" className="container">
                <div className="filter-container mt20">
                    <SearchBar onSearch={handleSearch} />

                    <MdClear className='clear-filters-btn' onClick={handleClearFilters}/>
                </div>

                <div className='new-post-container mt20 w100'>
                    <Link to="/postform/create">
                        <span className='btn btn-primary' style={{width:"100%"}}>Nova Publicação</span>
                    </Link>
                </div>

                <div className="catalog-grid mb20 mt20">
                    {user && posts.map(post => (
                        <PostCard post={post} user={user} key={post.id} />
                    ))}
                </div>

                {!isLastPage && <ButtonNextPage onNextPage={handleNextPageClick} />}
            </section>
        </main>
    );
}
