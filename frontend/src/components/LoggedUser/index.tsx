import { useContext } from 'react';
import { Link } from 'react-router-dom';
import * as authService from '../../services/authService';
import { ContextToken } from '../../utils/context-token';

export default function LoggedUser() {

    const { contextTokenPayload, setContextTokenPayload } = useContext(ContextToken);

    function handleLogoutClick() {
        authService.logout();
        setContextTokenPayload(undefined);
    }

    return (
        contextTokenPayload && authService.isAuthenticated()
            ? (
                <div className="logged-user">
                    <p>{contextTokenPayload.user_name}</p>
                    <span onClick={handleLogoutClick}>Sair</span>
                </div>
            )
            : (
                <Link to="/login">
                    Login
                </Link>
            )
    );
}
