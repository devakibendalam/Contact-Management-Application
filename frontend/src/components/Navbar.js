import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import ToastContext from "../context/ToastContext";
import {
  FaUser,
  FaAddressBook,
  FaPlusSquare,
  FaFileCsv,
  FaFileCsv as FaFileCsvSolid,
} from "react-icons/fa";
import { CSVLink } from "react-csv";
import Papa from "papaparse";

const Navbar = ({ title = "Contact Management System" }) => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const { toast } = useContext(ToastContext);

  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    async function fetchContacts() {
      try {
        const res = await fetch(`http://localhost:8000/api/mycontacts`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await res.json();
        if (!result.error) {
          setContacts(result.contacts);
        } else {
          console.log(result);
          toast.error(result.error);
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchContacts();
  }, [toast]);

  const handleCSVFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const importedContacts = result.data;
        setContacts(importedContacts);
        toast.success("Contacts imported successfully");
      },
      error: (error) => {
        console.error("Error importing contacts:", error.message);
        toast.error("Error importing contacts");
      },
    });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    toast.success("Logged out.");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link to="/">
          <span className="navbar-brand">{title}</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarColor01"
          aria-controls="navbarColor01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarColor01">
          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                <li className="nav-item">
                  <Link to="/mycontacts">
                    <span className="nav-link">
                      <FaAddressBook /> All Contacts
                    </span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/create">
                    <span className="nav-link">
                      <FaPlusSquare /> Create
                    </span>
                  </Link>
                </li>
                <li className="nav-item">
                  <CSVLink
                    data={contacts}
                    filename={"contacts.csv"}
                    className="nav-link"
                  >
                    <FaFileCsvSolid /> Export Contacts
                  </CSVLink>
                </li>
                <li className="nav-item">
                  <label htmlFor="importContactsInput" className="nav-link">
                    <FaFileCsv /> Import Contacts
                  </label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCSVFileUpload}
                    style={{ display: "none" }}
                    id="importContactsInput"
                  />
                </li>
                <li className="nav-item">
                  <span
                    className="nav-link"
                    onClick={handleLogout}
                    style={{ cursor: "pointer" }}
                  >
                    <FaUser /> Logout
                  </span>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login">
                    <span className="nav-link">
                      <FaUser /> Login
                    </span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register">
                    <span className="nav-link">
                      <FaUser /> Register
                    </span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
