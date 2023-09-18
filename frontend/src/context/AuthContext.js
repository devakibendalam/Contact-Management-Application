import React, { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await res.json();
        if (!result.error) {
          if (
            location.pathname === "/login" ||
            location.pathname === "/register"
          ) {
            setTimeout(() => {
              navigate("/", { replace: true });
            }, 500);
          } else {
            navigate(location.pathname ? location.pathname : "/");
          }
          setUser(result);
        } else {
          navigate("/login", { replace: true });
        }
      } catch (err) {
        console.log(err);
      }
    };

    checkUserLoggedIn();
  }, [location.pathname, navigate]);

  const loginUser = async (userData) => {
    try {
      const res = await fetch(`http://localhost:8000/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...userData }),
      });
      const result = await res.json();
      if (!result.error) {
        localStorage.setItem("token", result.token);
        setUser(result.user);
        toast.success(`Logged in ${result.user.name}`);

        navigate("/", { replace: true });
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  
  const registerUser = async (userData) => {
    try {
      const res = await fetch(`http://localhost:8000/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...userData }),
      });
      const result = await res.json();

      if (!result.error) {
        toast.success("User registered successfully! Login into your account!");
        navigate("/login", { replace: true });
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider value={{ loginUser, registerUser, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
