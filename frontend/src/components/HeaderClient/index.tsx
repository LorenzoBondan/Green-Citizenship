import './styles.css';
import { Link } from 'react-router-dom';
import iconAdmin from '../../assets/admin.svg';
import * as authService from '../../services/authService';
import { useContext } from 'react';
import { ContextToken } from '../../utils/context-token';
import LoggedUser from '../LoggedUser';
import { FaUser } from 'react-icons/fa';
import NotificationList from '../NotificationList';


export default function HeaderClient() {

    const { contextTokenPayload } = useContext(ContextToken);

    return (
        <header className="header-client">
            <nav className="container">
                <Link to="/">
                    <h1>Cidadania Verde</h1>
                </Link>
                <div className="navbar-right">
                    <div className="menu-items-container">
                        {
                            contextTokenPayload &&
                            authService.hasAnyRoles(['ROLE_ADMIN']) &&
                            <Link to="/admin">
                                <div className="menu-item">
                                    <img src={iconAdmin} alt="Admin" />
                                </div>
                            </Link>
                        }
                        {
                            authService.isAuthenticated() && (
                                <>
                                    <div className="menu-item">
                                        <NotificationList />
                                    </div>
                                    <Link to="/profile">
                                        <div className="menu-item">
                                            <FaUser />
                                        </div>
                                    </Link>
                                </>
                            )
                        }

                    </div>
                    <LoggedUser />
                </div>
            </nav>
        </header>
    );
}
