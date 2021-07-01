import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import MydModalWithGrid from "../../controls/MyModalWithGrid";
import Button from "@material-ui/core/Button";
import GetAppIcon from "@material-ui/icons/GetApp";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { makeStyles } from "@material-ui/core/styles";

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

const AuxDocument = (props) => (
  //let fileWithoutExtensionName=props.document.name;
  <tr className={props.classes.root}>
    <td style={{ textAlign: "left", verticalAlign: "middle" }}>
      <span>
        {
          props.document.name //.split(".").slice(0, -1).join(".")
        }
      </span>
    </td>

    {/* <td style={{ textAlign: "left", verticalAlign: "middle" }}>
      <span>
        {
          props.document.name //.split(".").slice(0, -1).join(".")
        }
      </span>
    </td>

    <td style={{ textAlign: "left", verticalAlign: "middle" }}>
      <span>
        {
          props.document.name //.split(".").slice(0, -1).join(".")
        }
      </span>
    </td> */}

    <td className="d-flex justify-content-center">
      <div className="d-flex flex-row">
        <div className="p-2">
          <Button
            className={props.classes.controlButtons}
            variant="contained"
            onClick={(e) => {
              e.preventDefault();
              props.downloadDocument(props.document.name);
            }}
          >
            <GetAppIcon />
          </Button>
        </div>
      </div>

      {(props.isAdmin || props.isCoordinator) && (
        <div className="d-flex flex-row">
          <div className="p-2">
            <Button
              className={props.classes.controlButtons}
              variant="contained"
              //color="primary"
              onClick={(e) => {
                e.preventDefault();
                props.deleteDocument(props.document.name);
              }}
            >
              <DeleteForeverIcon />
            </Button>
          </div>
        </div>
      )}

      {!(props.isAdmin || props.isCoordinator) && (
        <div className="d-flex flex-row">
          <div className="p-2">
            <Button
              disabled
              className={props.classes.controlButtons}
              variant="contained"
              //color="primary"
            >
              <DeleteForeverIcon />
            </Button>
          </div>
        </div>
      )}
    </td>
  </tr>
);

export default function Preview(props) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const history = useHistory();
  const { projectId } = useParams();
  const [project, setProject] = useState({});
  const [user, setUser] = useState({});
  const [documents, setDocuments] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const classes = useStyles();

  const goBack = () => {
    history.goBack();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const _id = localStorage.getItem("_id");
      const resultUser = await axios("http://localhost:9000/users/" + _id);
      setUser(resultUser.data);
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(String(reader.result));
      };
      reader.readAsDataURL(image);
    } else {
      setPreview(null);
    }
  }, [image]);

  useEffect(() => {
    const fetchDocumentData = async () => {
      const result = await axios(
        "http://localhost:9000/projects/" +
          projectId +
          "/content/get-all-files/"
      );
      if (result.data.fileInfos) {
        setDocuments(result.data.fileInfos);
        setProject(result.data.project);
      } else {
        setErrorMessage(result.data.message);
      }
    };

    fetchDocumentData();
  }, []);

  function deleteDocument(name) {
    axios
      .delete(
        "http://localhost:9000/projects/" +
          projectId +
          "/content/delete-file/" +
          name
      )
      .then((response) => {
        console.log(response.data);
      });

    setDocuments(documents.filter((el) => el.name !== name));
  }

  function downloadDocument(target) {
    axios({
      url:
        "http://localhost:9000/projects/" +
        projectId +
        "/content/get-file/" +
        target,
      method: "GET",
      responseType: "blob",
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", target);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function documentList() {
    return documents.map((currentDocument) => {
      let isCoordinator = null;
      if (user.username === project.coordinator) isCoordinator = true;
      else isCoordinator = false;
      return (
        <AuxDocument
          classes={classes}
          document={currentDocument}
          deleteDocument={deleteDocument}
          downloadDocument={downloadDocument}
          key={currentDocument.name}
          isAdmin={user?.rights?.isAdmin}
          isCoordinator={isCoordinator}
        />
      );
    });
  }

  return (
    <>
      {errorMessage !== "" && (
        <>
          <div style={{ color: "red", padding: "3%" }}>
            {
              <strong>{`${errorMessage} Trebuie ca mai intai sa incarcati documente pentru acest proiect.`}</strong>
            }
          </div>
          <div className="d-flex flex-row">
            <div className="p-2">
              <button className="btn btn-primary btn-block" onClick={goBack}>
                Inapoi
              </button>
            </div>
          </div>
        </>
      )}
      {errorMessage === "" && (
        <>
          {" "}
          <br />
          <div className="d-flex flex-row-reverse">
            <div className="p-2 ">
              <MydModalWithGrid></MydModalWithGrid>
            </div>
          </div>
          <hr></hr>
          <div
            style={{
              paddingLeft: "5%",
              paddingRight: "5%",
            }}
          >
            <div className="d-flex justify-content">
              <h2>{`${project.description} > documente`}</h2>
            </div>

            <br />
            <div>
              <table className="table">
                <thead className="thead-light">
                  <tr>
                    <th style={{ textAlign: "left", verticalAlign: "middle" }}>
                      Descriere
                    </th>

                    {/* <th style={{ textAlign: "left", verticalAlign: "middle" }}>
                      Incarcat de
                    </th>

                    <th style={{ textAlign: "left", verticalAlign: "middle" }}>
                      Incarcat la data
                    </th> */}

                    <th
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                    >
                      Actiuni
                    </th>
                  </tr>
                </thead>
                <tbody>{documentList()}</tbody>
              </table>
            </div>
          </div>
          <br />
          <br />
          <div className="d-flex flex-row">
            <div className="p-2">
              <button className="btn btn-primary btn-block" onClick={goBack}>
                Inapoi
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
