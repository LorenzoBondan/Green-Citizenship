import './styles.css';
import * as postService from '../../../services/postService';
import { useEffect, useState } from 'react';
import SearchBar from '../../../components/SearchBar';
import ButtonNextPage from '../../../components/ButtonNextPage';
import { DUser } from '../../../models/user';
import * as userService from '../../../services/userService';
import * as authService from '../../../services/authService';
import { MdClear } from "react-icons/md";
import { DPost } from '../../../models/post';
import PostCard from '../../../components/PostCard';

type QueryParams = {
    page: number;
    title: string;
    categoryId: number;
}

export default function PostCatalog() {
    const [isLastPage, setIsLastPage] = useState(false);
    const [posts, setPosts] = useState<DPost[]>([]);
    const [queryParams, setQueryParam] = useState<QueryParams>({
        page: 0,
        title: "",
        categoryId: 0
    });

    useEffect(() => {

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

    const [user, setUser] = useState<DUser>();

    useEffect(() => {
        if (authService.isAuthenticated()) {
            userService.findMe()
                .then(response => setUser(response.data))
                .catch(() => {});
        }
    }, []);

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

                <div className="catalog-grid mb20 mt20">
                    {posts.map(post => (
                        <PostCard post={post} key={post.id} />
                    ))}
                </div>

                {!isLastPage && <ButtonNextPage onNextPage={handleNextPageClick} />}
            </section>
        </main>
    );
}
