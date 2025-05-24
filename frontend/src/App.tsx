import { useEffect, useState } from "react";
import { AccessTokenPayloadDTO } from "./models/auth";
import * as authService from "../src/services/authService";
import { ContextToken } from "./utils/context-token";
import { Navigate, Route, Routes } from "react-router-dom";
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { history } from './utils/history';
import ClientHome from "./routes/ClientHome";
import Login from "./routes/ClientHome/Login";
import PostCatalog from "./routes/ClientHome/PostCatalog";
import PostDetails from "./routes/ClientHome/PostDetails";
import PostForm from "./routes/ClientHome/PostForm";
import { PrivateRoute } from "./components/PrivateRoute";
import Admin from "./routes/Admin";
import AdminHome from "./routes/Admin/AdminHome";
import AuthProvider from "./utils/AuthProvider";
import Users from "./routes/Admin/User";
import UserList from "./routes/Admin/User/UserList";
import UserForm from "./routes/Admin/User/UserForm";
import UserRegisterForm from "./routes/ClientHome/UserRegisterForm";
import Profile from "./routes/ClientHome/Profile";

export default function App() {

  const [contextTokenPayload, setContextTokenPayload] = useState<AccessTokenPayloadDTO>();

  useEffect(() => {

    if (authService.isAuthenticated()) {
      const payload = authService.getAccessTokenPayload();
      setContextTokenPayload(payload);
    }
  }, []);

  return (
    <ContextToken.Provider value={{ contextTokenPayload, setContextTokenPayload }}>
      <AuthProvider>
        <HistoryRouter history={history}>
          <Routes>
            <Route path="/" element={<ClientHome /> }>
              <Route index element={<PostCatalog isAdminPage={false} />} />
              <Route path="posts" element={<PostCatalog isAdminPage={false} />} />
              <Route path="posts/:postId" element={<PostDetails />} />
              <Route path="postform/create" element={<PostForm />} />
              <Route path="postform/:postId" element={<PostForm />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<UserRegisterForm />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="/admin/" element={<PrivateRoute roles={['ROLE_ADMIN']}><Admin /></PrivateRoute>}>
              <Route index element={<Navigate to="/admin/home" />} />
              <Route path="home" element={<AdminHome />} />
              <Route path="users" element={<Users />}>
                <Route index element={<UserList />} />
                <Route path=":userId" element={<UserForm />} />
              </Route>
              <Route path="posts" element={<PostCatalog isAdminPage={true} />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </HistoryRouter>
      </AuthProvider>
    </ContextToken.Provider>
  );
}
