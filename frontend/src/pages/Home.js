import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import AuthContext from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [navigate, user]);

  return (
    <>
      <div className="jumbotron">
        <h1>Welcome {user ? user.name : null}</h1>
        <hr className="my-4" />
        <Link to="/create" className="btn btn-info" role="button">
          Add Contacts
        </Link>
      </div>
    </>
  );
};

export default Home;
