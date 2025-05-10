import './styles.css';
import { useEffect, useState } from 'react';
import { DUser } from '../../../models/user';
import * as userService from '../../../services/userService';
import { Link } from 'react-router-dom';

export default function AdminHome() {

    const [user, setUser] = useState<DUser>();

    useEffect(() => {
        userService.findMe()
            .then(response => {
                setUser(response.data);
                console.log(response.data);
            });
    }, [])

    return (
        <main className='admin-page-container container'>
            <section id="admin-home-section">
                <h2 className="section-title mb20">Bem-vindo a tela de administrador, {user?.name}</h2>
            </section>
            <section className='container admin-items-section'>
                <div className='admin-item card'>
                    <Link to="/admin/posts">
                        <div className='btn btn-blue'>Publicações pendentes</div>
                    </Link>
                </div>
                <div className='admin-item card'>
                    <Link to="/admin/users">
                        <div className='btn btn-blue'>Usuários</div>
                    </Link>
                </div>
            </section>
        </main>
    );
}