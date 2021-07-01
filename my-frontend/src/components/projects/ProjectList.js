import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Button from "@material-ui/core/Button";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";

import Header from "../Header";
import KanbanBoard from "../kanban/KanbanBoard";

const useStyles = makeStyles({
  root: {
    "& > *": {
      // borderBottom: "unset",
      "&:hover": {
        backgroundColor: "#f2f2f2",
      },
      "&:hover $controlButtons": {
        display: "inline-block",
      },
    },
  },

  controlButtons: {
    display: "none",
    backgroundColor: "#4285F4",
    "&:hover": {
      display: "inline-block",
      backgroundColor: "#07398a",
    },
  },
});

const BlueRadio = withStyles({
  root: {
    color: blue[500],
    "&$checked": {
      color: blue[700],
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

const AuxProject = (props) => (
  <tr className={props.classes.root}>
    <td>
      <Link
        to={"/projects/view/" + props.project._id}
        className="btn btn-link btn-block text-left"
        //btn btn-primary btn-lg btn-block
      >
        {props.project.description}
      </Link>{" "}
    </td>

    <td style={{ textAlign: "left", verticalAlign: "middle" }}>
      <span>{new Date(String(props.project.updatedAt)).getFullYear()}</span>
    </td>

    <td style={{ textAlign: "left", verticalAlign: "middle" }}>
      <span>
        {props.project.status === "active"
          ? "ACTIV"
          : props.project.status === "suspended"
          ? "SUSPENDAT"
          : "FINALIZAT"}
      </span>
    </td>

    <td style={{ textAlign: "left", verticalAlign: "middle" }}>
      <span>{props.project.coordinator}</span>
    </td>

    <td className="d-flex justify-content-center">
      {props.isAdmin && (
        <div className="d-flex flex-row">
          <div className="p-2">
            <Link to={"/projects/edit/" + props.project._id}>
              <Button
                className={props.classes.controlButtons}
                variant="contained"
                //color="primary"
              >
                <EditIcon />
              </Button>
            </Link>
          </div>

          <div className="p-2">
            <Link
              to={{
                pathname: "/preview/" + props.project._id,
              }}
            >
              <Button
                className={props.classes.controlButtons}
                variant="contained"
                //color="secondary"
                onClick={() => {}}
              >
                <VisibilityIcon />
              </Button>
            </Link>
          </div>

          <div className="p-2">
            <Button
              className={props.classes.controlButtons}
              variant="contained"
              //color="secondary"
              onClick={() => {
                props.deleteProject(props.project._id);
              }}
            >
              <DeleteForeverIcon />
            </Button>
          </div>
        </div>
      )}

      {!props.isAdmin && props.hasWritePermission && (
        <div className="d-flex flex-row">
          <div className="p-2">
            <Link to={"/projects/edit/" + props.project._id}>
              <Button
                className={props.classes.controlButtons}
                variant="contained"
                //color="primary"
              >
                <EditIcon />
              </Button>
            </Link>
          </div>

          <div className="p-2">
            <Link
              to={{
                pathname: "/preview/" + props.project._id,
              }}
            >
              <Button
                className={props.classes.controlButtons}
                variant="contained"
                //color="secondary"
                onClick={() => {}}
              >
                <VisibilityIcon />
              </Button>
            </Link>
          </div>

          <div className="p-2">
            <Button
              disabled
              className={props.classes.controlButtons}
              variant="contained"
              //color="secondary"
              onClick={() => {
                props.deleteProject(props.project._id);
              }}
            >
              <DeleteForeverIcon />
            </Button>
          </div>
        </div>
      )}

      {!props.isAdmin && !props.hasWritePermission && (
        <div className="d-flex flex-row">
          <div className="p-2">
            <Link to={"/projects/edit/" + props.project._id}>
              <Button variant="contained" color="primary" disabled>
                <EditIcon />
              </Button>
            </Link>
          </div>
          <div className="p-2">
            <Button
              disabled
              variant="contained"
              color="secondary"
              onClick={() => {
                props.deleteProject(props.project._id);
              }}
            >
              <DeleteForeverIcon />
            </Button>
          </div>
        </div>
      )}
    </td>
  </tr>
);

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [viewType, setViewType] = useState("list");
  const [rights, setRights] = useState(null);

  const classes = useStyles();

  const handleChange = (event) => {
    setViewType(event.target.value);
  };

  useEffect(() => {
    const fetchUserRight = async () => {
      const _id = localStorage.getItem("_id");
      const resultUser = await axios("http://localhost:9000/users/" + _id);
      setRights(resultUser.data.rights);
    };

    fetchUserRight();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("http://localhost:9000/projects");
      setProjects(result.data);
    };

    fetchData();
  }, []);

  function deleteProject(id) {
    axios.delete("http://localhost:9000/projects/" + id).then((response) => {
      console.log(response.data);
    });

    setProjects(projects.filter((el) => el._id !== id));
  }

  function projectList() {
    return projects.map((currentProject) => {
      let hasWritePermission = rights.canWriteInProjects.indexOf(
        currentProject._id
      );
      if (hasWritePermission !== -1) hasWritePermission = true;
      else hasWritePermission = false;
      return (
        <AuxProject
          classes={classes}
          project={currentProject}
          deleteProject={deleteProject}
          key={currentProject._id}
          isAdmin={rights.isAdmin}
          hasWritePermission={hasWritePermission}
        />
      );
    });
  }

  if (projects.length === 0) return <h2>Waiting...</h2>;
  else
    return (
      <>
        <Header />
        <hr></hr>
        <div
          style={{
            paddingLeft: "5%",
            paddingRight: "5%",
          }}
        >
          <div className="d-flex justify-content-between">
            <h2>Proiecte</h2>
            <div>
              {/* <h3> Vizualizare</h3> */}
              <RadioGroup
                row
                aria-label="contentView"
                name="contentView1"
                value={viewType}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="list"
                  control={<BlueRadio />}
                  label="list"
                />
                <FormControlLabel
                  value="kanban-board"
                  control={<BlueRadio />}
                  label="kanban-board"
                />
              </RadioGroup>
            </div>
          </div>
        </div>

        {viewType === "list" ? (
          <div
            style={{
              paddingLeft: "5%",
              paddingRight: "5%",
            }}
          >
            <br />
            <div>
              <table className="table">
                <thead className="thead-light">
                  <tr>
                    <th
                      style={{
                        paddingLeft: "3%",
                        textAlign: "left",
                        verticalAlign: "middle",
                      }}
                    >
                      Descriere
                    </th>
                    <th style={{ textAlign: "left", verticalAlign: "middle" }}>
                      An
                    </th>
                    <th style={{ textAlign: "left", verticalAlign: "middle" }}>
                      Status
                    </th>
                    <th style={{ textAlign: "left", verticalAlign: "middle" }}>
                      Coordonator
                    </th>
                    <th style={{ textAlign: "left", verticalAlign: "middle" }}>
                      Actiuni
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rights ? (
                    projectList()
                  ) : (
                    <tr>
                      <td>
                        <h2>Waiting...</h2>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <br />
            <br />
            {rights?.isAdmin ? (
              <Link to={"/projects/create"} className="btn btn-primary">
                Creeaza proiect
              </Link>
            ) : null}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              backgroundColor: "white",
              color: "blue",
              marginLeft: "10%",
              marginRight: "10%",
              borderRadius: "25px",
            }}
          >
            <KanbanBoard />
          </div>
        )}
      </>
    );
}
