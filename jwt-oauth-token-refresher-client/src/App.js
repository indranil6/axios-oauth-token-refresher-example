import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Redirect,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { AxiosInstance, Storages } from "axios-oauth2-token-refresher";
import axios from "axios";

const App = () => {
  const [tokens, setTokens] = useState({
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
  });

  useEffect(() => {
    if (tokens.accessToken) {
      localStorage.setItem("accessToken", tokens.accessToken);
    }
    if (tokens.refreshToken) {
      localStorage.setItem("refreshToken", tokens.refreshToken);
    }
  }, [tokens]);

  const axiosInstance = new AxiosInstance({
    axios,
    baseURL: "http://localhost:5000",
    accessTokenStorage: Storages.localStorage,
    refreshTokenStorage: Storages.localStorage,
    accessTokenStorageKey: "accessToken",
    refreshTokenStorageKey: "refreshToken",
    accessTokenRefresherEndpoint: "http://localhost:5000/token",
  }).getAxiosInstance();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setTokens={setTokens} />}></Route>
        <Route
          path="/dashboard"
          element={
            <>
              {tokens.accessToken ? (
                <Dashboard axiosInstance={axiosInstance} />
              ) : (
                <Navigate to="/login" />
              )}
            </>
          }
        ></Route>
        <Route path="*" element={<Login setTokens={setTokens} />}></Route>
      </Routes>
    </Router>
  );
};

export default App;
