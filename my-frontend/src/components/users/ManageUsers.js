import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Header from "../Header";
import axios from "axios";

export default function ManageUsers(props) {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [dataForSend, setDataForSend] = useState({
    userId: "",
    projectId: "",
    isAdmin: false,
    rightOfRead: false,
    rightOfWrite: false,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const history = useHistory();

  useEffect(() => {
    const fetchProjects = async () => {
      const resultProjects = await axios("http://localhost:9000/projects");
      setProjects(resultProjects.data);
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const resultUsers = await axios("http://localhost:9000/users");
      setUsers(resultUsers.data);
    };

    fetchUsers();
  }, []);

  const goBack = () => {
    history.goBack();
  };

  function sendPostRequest(value) {
    axios
      .post("http://localhost:9000/users/update-rights", value)
      .then((res) => {
        setSuccess(true);
        setMessage(res.data.msg);
      })
      .catch((err) => {
        setError(true);
        setMessage(err.response.data.err);
      });
  }

  function submitData(e) {
    e.preventDefault();

    if (dataForSend.userId === "") {
      setMessage(
        "Va rugam sa selectati utilizatorul asupra caruia doriti sa efectuati modificarea drepturilor"
      );
      setError(true);
    } else {
      if (dataForSend.isAdmin === false) {
        if (!dataForSend.projectId) {
          setError(true);
          setMessage(
            "Va rugam sa selectati proiectul asupra caruia doriti sa ii conferiti drepturi acestui utilizator"
          );
        } else if (
          dataForSend.rightOfRead === false &&
          dataForSend.rightOfWrite === false
        ) {
          setError(true);
          setMessage(
            "Va rugam sa selectati noile drepturi pentru user-ul si proiectul ales"
          );
        } else {
          sendPostRequest(dataForSend);
          setSuccess(true);
          setError(false);
        }
      } else {
        sendPostRequest(dataForSend);
        setSuccess(true);
        setError(false);
      }
    }
  }

  function handleChange(e) {
    setMessage("");
    const { name, value, type, checked } = e.target;
    type === "checkbox"
      ? setDataForSend((prevState) => {
          return {
            ...prevState,
            [name]: checked,
          };
        })
      : setDataForSend((prevState) => {
          return {
            ...prevState,
            [name]: value,
          };
        });
  }

  return (
    <>
      <Header />
      <br />
      <div
        style={{
          paddingLeft: "5%",
          paddingRight: "5%",
        }}
      >
        <form onSubmit={submitData}>
          <div className="form-group">
            <label>Selecteaza user: </label>
            <select
              className="form-control"
              value={dataForSend.user}
              name="userId"
              onChange={handleChange}
            >
              <option value="none value" key="none user">
                {"Alegeti"}
              </option>
              {users.map((user) => {
                return (
                  <option value={user._id} key={user._id}>
                    {user.username}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-group">
            <label>Selecteaza proiect: </label>
            <select
              className="form-control"
              value={dataForSend.project}
              name="projectId"
              onChange={handleChange}
            >
              <option value="none value" key="none project">
                {"Alegeti"}
              </option>
              {projects.map((project) => {
                return (
                  <option value={project._id} key={project._id}>
                    {project.description}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="rightOfRead"
                checked={dataForSend.rightOfRead}
                onChange={handleChange}
              />
              Drept citire
            </label>
            <br />

            <label>
              <input
                type="checkbox"
                name="rightOfWrite"
                checked={dataForSend.rightOfWrite}
                onChange={handleChange}
              />
              Drept scriere
            </label>
            <br />

            <label>
              <input
                type="checkbox"
                name="isAdmin"
                checked={dataForSend.isAdmin}
                onChange={handleChange}
              />
              Drept de admin
            </label>
            <br />
            {error !== false && (
              <div style={{ color: "red" }}>
                <strong>{message}</strong>
              </div>
            )}
            {success !== false && (
              <div style={{ color: "green" }}>
                <strong>{message}</strong>
              </div>
            )}
          </div>

          <div className="form-group">
            <input type="submit" value="Salveaza" className="btn btn-primary" />
          </div>
        </form>
        {/* <h2>Informatii date:</h2>
        <p>User -- {dataForSend.userId}</p>
        <p>Proiect-- {dataForSend.projectId}</p>
        <p>Admin?-- {dataForSend.isAdmin ? "yes" : " no"}</p>
        <p>Drept citire-- {dataForSend.rightOfRead ? "yes" : " no"}</p>
        <p>Drept scriere-- {dataForSend.rightOfWrite ? "yes" : " no"}</p> */}
      </div>
      <br />
      <div className="d-flex flex-row">
        <div className="p-2">
          <button className="btn btn-primary btn-block" onClick={goBack}>
            Inapoi
          </button>
        </div>
      </div>
    </>
  );
}
