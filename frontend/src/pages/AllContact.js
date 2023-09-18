import React, { useContext, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import ToastContext from "../context/ToastContext";

const AllContact = () => {
  const { toast } = useContext(ToastContext);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalData, setModalData] = useState({});
  const [contacts, setContacts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    async function fetchContacts() {
      setLoading(true);
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
          setLoading(false);
        } else {
          console.log(result);
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchContacts();
  }, []);

  const deleteContact = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        const res = await fetch(`http://localhost:8000/api/delete/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await res.json();
        if (!result.error) {
          setContacts(result.myContacts);
          toast.success("Deleted contact");
          setShowModal(false);
        } else {
          toast.error(result.error);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const newSearchUser = contacts.filter((contact) =>
      contact.name.toLowerCase().includes(searchInput.toLowerCase())
    );
    setContacts(newSearchUser);
  };

  const sortContacts = (criteria) => {
    let newSortOrder = "asc";
    if (criteria === sortBy) {
      // If sorting by the same criteria, toggle the sort order
      newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    }
    setSortBy(criteria);
    setSortOrder(newSortOrder);

    const sortedContacts = [...contacts];

    switch (criteria) {
      case "name":
        sortedContacts.sort((a, b) => {
          const order = newSortOrder === "asc" ? 1 : -1;
          return order * a.name.localeCompare(b.name);
        });
        break;
      case "address":
        sortedContacts.sort((a, b) => {
          const order = newSortOrder === "asc" ? 1 : -1;
          return order * a.address.localeCompare(b.address);
        });
        break;
      case "email":
        sortedContacts.sort((a, b) => {
          const order = newSortOrder === "asc" ? 1 : -1;
          return order * a.email.localeCompare(b.email);
        });
        break;
      case "phone":
        sortedContacts.sort((a, b) => {
          const order = newSortOrder === "asc" ? 1 : -1;
          return order * (a.phone - b.phone);
        });
        break;
      default:
        break;
    }

    setContacts(sortedContacts);
  };

  const reloadContacts = async () => {
    setLoading(true);
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
        setLoading(false);
      } else {
        toast.error(result.error);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      toast.error("Error reloading contacts");
      setLoading(false);
    }
  };

  return (
    <>
      <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1 style={{ fontFamily: "arial, sans-serif" }}>Your Contacts</h1>
            <a href="/mycontacts" className="btn btn-danger ml-2" onClick={reloadContacts}>
              Reload Contact
            </a>
      </div>

        <hr className="my-4" />
        {loading ? (
          <Spinner splash="Loading Contacts..." />
        ) : (
          <>
            {contacts.length === 0 ? (
              <h3>No contacts created yet</h3>
            ) : (
              <>
                <form className="d-flex" onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    name="searchInput"
                    id="searchInput"
                    className="form-control my-2"
                    placeholder="Search Contact"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <button type="submit" className="btn btn-info mx-2">
                    Search
                  </button>
                </form>
                <p>
                  Your Total Contacts: <strong>{contacts.length}</strong>
                </p>
                <table className="table table-hover">
                  <thead>
                    <tr className="table-dark">
                      <th
                        scope="col"
                        onClick={() => sortContacts("name")}
                        className={`sort-heading ${
                          sortBy === "name" ? "active" : ""
                        }`}
                        style={{ cursor: "pointer" }}
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        onClick={() => sortContacts("address")}
                        className={`sort-heading ${
                          sortBy === "address" ? "active" : ""
                        }`}
                        style={{ cursor: "pointer" }}
                      >
                        Address
                      </th>
                      <th
                        scope="col"
                        onClick={() => sortContacts("email")}
                        className={`sort-heading ${
                          sortBy === "email" ? "active" : ""
                        }`}
                        style={{ cursor: "pointer" }}
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        onClick={() => sortContacts("phone")}
                        className={`sort-heading ${
                          sortBy === "phone" ? "active" : ""
                        }`}
                        style={{ cursor: "pointer" }}
                      >
                        Phone
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact) => (
                      <tr
                        key={contact._id}
                        onClick={() => {
                          setModalData({});
                          setModalData(contact);
                          setShowModal(true);
                        }}
                      >
                        <th scope="row">{contact.name}</th>
                        <td>{contact.address}</td>
                        <td>{contact.email}</td>
                        <td>{contact.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </>
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalData.name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <h3>{modalData.name}</h3>
          <p>
            <strong>Address</strong>: {modalData.address}
          </p>
          <p>
            <strong>Email</strong>: {modalData.email}
          </p>
          <p>
            <strong>Phone Number</strong>: {modalData.phone}
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Link className="btn btn-info" to={`/edit/${modalData._id}`}>
            Edit
          </Link>
          <button
            className="btn btn-danger"
            onClick={() => deleteContact(modalData._id)}
          >
            Delete
          </button>
          <button
            className="btn btn-warning"
            onClick={() => setShowModal(false)}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AllContact;
