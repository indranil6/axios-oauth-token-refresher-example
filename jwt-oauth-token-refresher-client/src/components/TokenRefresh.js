import React from "react";
import axios from "axios";

const TokenRefresh = ({ tokens, setTokens }) => {
  const refreshTokens = async () => {
    try {
      const response = await axios.post("http://localhost:5000/token", {
        token: tokens.refreshToken,
      });
      setTokens(response.data);
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
    } catch (error) {
      console.error("Token refresh failed", error);
    }
  };

  return <button onClick={refreshTokens}>Refresh Tokens</button>;
};

export default TokenRefresh;
