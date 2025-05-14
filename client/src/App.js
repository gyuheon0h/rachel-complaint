import { useEffect, useState } from "react";
import Page from "./Page";
import AuthForm from "./AuthForm";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    
    setToken(storedToken);
  }, []);

  const handleLogin = (jwt) => {
    localStorage.removeItem("token");
    localStorage.setItem("token", jwt);
    setToken(jwt);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return token ? (
    <Page onLogout={handleLogout} token={token} />
  ) : (
    <AuthForm onAuthSuccess={handleLogin} />
  );
}

export default App;
