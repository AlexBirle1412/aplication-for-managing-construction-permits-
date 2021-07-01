import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import Header from "../Header";
//import "react-datepicker/dist/react-datepicker.css";
// import DatePicker from "react-datepicker";

export default function CreateOrEditProject(props) {
  const history = useHistory();
  const goBack = () => {
    history.goBack();
  };
  const [myData, setMyData] = useState({
    userNames: [],
    coordinator: "",
    description: "",
    status: "",
    forEdit: props.forEdit,
  });

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUserRight = async () => {
      const resultUsers = await axios("http://localhost:9000/users");
      let names = resultUsers.data.map((user) => {
        return user.username;
      });

      setMyData((prevState) => {
        return {
          ...prevState,
          userNames: names,
        };
      });
    };

    fetchUserRight();
  }, []);

  useEffect(() => {
    if (myData.forEdit) {
      const fetchExistingDescriptionForProject = async () => {
        const resultDescription = await axios(
          "http://localhost:9000/projects/" + props.match.params.id
        );

        setMyData((prevState) => {
          return {
            ...prevState,
            description: resultDescription.data.description,
          };
        });
      };
      fetchExistingDescriptionForProject();
    } else return;
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setMyData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (myData.description.length < 60) {
      setError(false);
      //none value
      const project = {
        coordinator:
          myData.coordinator !== "none value" ? myData.coordinator : undefined,
        status: myData.status,
        description: myData.description,
      };

      if (!myData.forEdit)
        axios
          .post("http://localhost:9000/projects/add", project)
          .then((res) => console.log(res.data))
          .then(() => {
            window.location = "/projects";
          });
      else console.log(project);
      axios
        .post(
          "http://localhost:9000/projects/update/" + props.match.params.id,
          project
        )
        .then((res) => console.log(res.data))
        .then(() => {
          window.location = "/projects";
        });
    } else {
      setError(true);
      setErrorMessage("Descrierea nu trebuie sa depaseasca 60 de caractere");
    }
  }

  return (
    <>
      {error && alert(errorMessage)}
      <Header />
      <br />
      <div
        style={{
          paddingLeft: "5%",
          paddingRight: "5%",
        }}
      >
        <h3>
          {myData.forEdit === true
            ? "Editeaza proiectul curent"
            : "Adauga proiect"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Coordonator: </label>
            <select
              className="form-control"
              name="coordinator"
              onChange={handleChange}
            >
              <option value="none value" key="none key">
                {"Alegeti"}{" "}
              </option>
              {myData.userNames.map((name) => {
                return (
                  <option value={name} key={name}>
                    {name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-group">
            <label>Descriere: </label>
            <input
              type="text"
              name="description"
              required
              className="form-control"
              value={myData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Status: </label>
            <select
              className="form-control"
              name="status"
              onChange={handleChange}
            >
              <option value="none value" key="none key">
                {"Alegeti"}{" "}
              </option>
              {myData.forEdit
                ? ["Activ", "Suspendat", "Finalizat"].map((status) => {
                    return (
                      <option value={status} key={status}>
                        {status}
                      </option>
                    );
                  })
                : ["Activ", "Suspendat"].map((status) => {
                    return (
                      <option value={status} key={status}>
                        {status}
                      </option>
                    );
                  })}
            </select>
          </div>
          {/* <div className="form-group">
              <label>Date: </label>
              <div>
                <DatePicker
                  selected={this.state.date}
                  onChange={this.onChangeDate}
                />
              </div>
            </div> */}

          <div className="form-group">
            <input type="submit" value="Salveaza" className="btn btn-primary" />
          </div>
        </form>
      </div>

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
