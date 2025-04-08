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
        <HistoryRouter history={history}>
          <Routes>
            <Route path="/" element={<ClientHome /> }>
              <Route index element={<PostCatalog />} />
              <Route path="posts" element={<PostCatalog />} />
              <Route path="posts/:postId" element={<PostDetails />} />
              <Route path="login" element={<Login />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </HistoryRouter>
    </ContextToken.Provider>
  );
}
