import './styles.css';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../utils/auth-context';

export default function AdminHome() {

    const { user } = useContext(AuthContext);

    return (
        <main className='admin-page-container container'>
            <section id="admin-home-section">
                <h2 className="section-title mb20">Bem-vindo a tela de administrador, {user?.name}</h2>
            </section>
            <section className='container admin-items-section'>
                <div className='admin-item card'>
                    <Link to="/admin/users">
                        <div className='btn btn-primary'>Publicações pendentes</div>
                    </Link>
                </div>
                <div className='admin-item card'>
                    <Link to="/admin/users">
                        <div className='btn btn-primary'>Usuários</div>
                    </Link>
                </div>
            </section>
        </main>
    );
}