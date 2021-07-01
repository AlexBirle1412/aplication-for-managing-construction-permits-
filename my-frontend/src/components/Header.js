import React, { useState, useEffect } from "react";
import axios from "axios";
import AuthService from "../controls/AuthService";
import { Link } from "react-router-dom";

export default function Header(props) {
  const [rights, setRights] = useState([]);

  useEffect(() => {
    const _id = localStorage.getItem("_id");
    const fetchData = async () => {
      const result = await axios("http://localhost:9000/users/" + _id);
      setRights(result.data.rights);
    };

    fetchData();
  }, []);

  if (rights.isAdmin === true)
    return (
      <>
        <br />
        <div
          style={{ paddingRight: "3%" }}
          className="d-flex d-flex justify-content-end"
        >
          <div className="p-2">
            <Link to={"/projects"} className="btn btn-primary btn-block">
              Acasa
            </Link>
          </div>

          <div className="p-2">
            <Link to={"/statistics"} className="btn btn-primary btn-block">
              Statistici
            </Link>
          </div>

          <div className="p-2">
            <Link to={"/manage-users"} className="btn btn-primary btn-block">
              Useri
            </Link>
          </div>

          <div className="p-2">
            <button
              className="btn btn-primary btn-block"
              onClick={() => {
                AuthService.logout();
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </>
    );
  else
    return (
      <>
        <br />
        <div className="d-flex d-flex justify-content-end">
          <div className="p-2">
            <Link to={"/projects"} className="btn btn-primary btn-block">
              Home
            </Link>
          </div>

          <div className="p-2">
            <button
              className="btn btn-primary btn-block"
              onClick={() => {
                AuthService.logout();
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </>
    );
}
