import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import BackupIcon from "@material-ui/icons/Backup";
import Button from "@material-ui/core/Button";
import EditInput from "../../controls/EditInput";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import AddBoxIcon from "@material-ui/icons/AddBox";
import Header from "../Header";
import MyVerticallyCenteredModal from "../../controls/MyVerticallyCenteredModal";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      // borderBottom: "unset",
      "&:hover": {
        backgroundColor: "#f2f2f2",
      },
      "&:hover $hideButtons": {
        display: "inline-block",
      },
    },
  },
  hideButtons: {
    display: "none",
    backgroundColor: "#4285F4",
    "&:hover": {
      display: "inline-block",
      backgroundColor: "#07398a",
    },
  },
  addButon: {
    backgroundColor: "#4285F4",
    "&:hover": {
      backgroundColor: "#07398a",
    },
  },
});

function Row(props) {
  const {
    number,
    row,
    deleteFunction,
    addFunction,
    modifyFunction,
    projectInfo,
    okId,
    user,
    last,
  } = props;

  const [open, setOpen] = useState(false);
  const classes = useRowStyles();

  function canEditInfo(thisUser, projectInfo) {
    return thisUser?.rights?.isAdmin ||
      thisUser?.username === projectInfo?.coordinator ||
      thisUser?.rights?.canWriteInProjects?.indexOf(projectInfo._id) !== -1
      ? true
      : false;
  }

  var splits = window.location.pathname.split("/");
  var projectId = -1;
  if (splits.length > 0) projectId = splits[splits.length - 1];

  return (
    <React.Fragment>
      <TableRow className={classes.root} enablecellselect="true">
        <TableCell>
          {last === false && (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
        {/* component="th" scope="row" */}
        <TableCell component="th" scope="row" align="left">
          {number}
        </TableCell>

        <TableCell align="left">
          {canEditInfo(user, projectInfo) ? (
            <EditInput
              okId={row._id}
              modifyInfo={modifyFunction}
              modifyKey="document"
              info={row.document}
            ></EditInput>
          ) : (
            row.document
          )}
        </TableCell>

        <TableCell align="left">
          {canEditInfo(user, projectInfo) ? (
            <EditInput
              okId={row._id}
              modifyInfo={modifyFunction}
              modifyKey="entity"
              info={row.entity}
            ></EditInput>
          ) : (
            row.entity
          )}
        </TableCell>

        <TableCell align="left">
          {canEditInfo(user, projectInfo) ? (
            <EditInput
              okId={row._id}
              modifyInfo={modifyFunction}
              modifyKey="contact"
              info={row.contact}
            ></EditInput>
          ) : (
            row.contact
          )}
        </TableCell>

        <TableCell align="left">
          {canEditInfo(user, projectInfo) ? (
            <EditInput
              okId={row._id}
              modifyInfo={modifyFunction}
              modifyKey="procedure"
              info={row.procedure}
            ></EditInput>
          ) : (
            row.procedure
          )}
        </TableCell>

        <TableCell align="left">
          {canEditInfo(user, projectInfo) ? (
            <EditInput
              okId={row._id}
              modifyInfo={modifyFunction}
              modifyKey="payments"
              info={row.payments}
            ></EditInput>
          ) : (
            row.payments
          )}
        </TableCell>

        <TableCell align="left">
          {canEditInfo(user, projectInfo) ? (
            <EditInput
              okId={row._id}
              modifyInfo={modifyFunction}
              modifyKey="status"
              info={row.status}
            ></EditInput>
          ) : (
            row.status
          )}
        </TableCell>

        <TableCell align="left">
          {last === false ? (
            <>
              {user?.rights?.isAdmin ||
              user?.username === projectInfo?.coordinator ? (
                <div className="d-flex flex-row">
                  <div className="p-2">
                    <Button
                      className={classes.hideButtons}
                      variant="contained"
                      //color="primary"
                      onClick={(e) => {
                        if (
                          window.confirm(
                            "Are you sure you wish to delete this item?"
                          )
                        )
                          deleteFunction(row._id);
                      }}
                    >
                      <DeleteForeverIcon />
                    </Button>
                  </div>
                  <div className="p-2">
                    <MyVerticallyCenteredModal
                      buttonStyle={`MuiButtonBase-root MuiButton-root MuiButton-contained makeStyles-hideButtons-8 ${classes.hideButtons}`}
                      isForUpdating={true}
                      //modifyId
                      okId={okId}
                      modifyFunction={modifyFunction}
                      addFunction={addFunction}
                    />
                  </div>
                  <div className="p-2">
                    <Link
                      to={{
                        pathname:
                          window.location.pathname + "/uploads/" + row._id,
                        projectId: projectId,
                        activityId: row._id,
                      }}
                    >
                      <Button
                        className={classes.hideButtons}
                        variant="contained"
                        //color="primary"
                      >
                        <BackupIcon />
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="d-flex flex-row">
                  <div className="p-2">
                    <Button
                      disabled
                      className={classes.hideButtons}
                      variant="contained"
                      //color="primary"
                    >
                      <DeleteForeverIcon />
                    </Button>
                  </div>

                  {user?.rights?.canWriteInProjects?.indexOf(
                    projectInfo._id
                  ) !== -1 ? (
                    <div className="d-flex flex-row">
                      <div className="p-2">
                        <MyVerticallyCenteredModal
                          buttonStyle={`MuiButtonBase-root MuiButton-root MuiButton-contained makeStyles-hideButtons-8 ${classes.hideButtons}`}
                          isForUpdating={true}
                          //modifyId
                          okId={okId}
                          modifyFunction={modifyFunction}
                          addFunction={addFunction}
                        />
                      </div>
                      <div className="p-2">
                        <Link
                          to={{
                            pathname:
                              window.location.pathname + "/uploads/" + row._id,
                            projectId: projectId,
                            activityId: row._id,
                          }}
                        >
                          <Button
                            className={classes.hideButtons}
                            variant="contained"
                            //color="primary"
                          >
                            <BackupIcon />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex flex-row">
                      <div className="p-2">
                        <Button
                          disabled
                          className={classes.hideButtons}
                          variant="contained"
                        >
                          <EditIcon />
                        </Button>
                      </div>
                      <div className="p-2">
                        <Link
                          to={{
                            pathname:
                              window.location.pathname + "/uploads/" + row._id,
                            projectId: projectId,
                            activityId: row._id,
                          }}
                          style={{ pointerEvents: "none" }}
                        >
                          <Button
                            disabled
                            className={classes.hideButtons}
                            variant="contained"
                            //color="primary"
                          >
                            <BackupIcon />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : user?.rights?.isAdmin ||
            user?.username === projectInfo?.coordinator ? (
            <>
              <MyVerticallyCenteredModal
                buttonStyle={classes.addButon}
                isForUpdating={false}
                addFunction={addFunction}
                modifyFunction={modifyFunction}
                okId={okId}
              />
            </>
          ) : (
            <Button
              className={classes.addButon}
              disabled
              variant="contained"
              //color="primary"
            >
              <AddBoxIcon />
            </Button>
          )}
        </TableCell>
      </TableRow>

      {/* PENTRU CEL INTERIOR */}
      {last === false && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  History
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Data</TableCell>
                      <TableCell>Nume title</TableCell>
                      <TableCell align="right">Observatii</TableCell>
                      {/* <TableCell align="right">Total price ($)</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.teamMembers.map((historyRow) => (
                      <TableRow key={historyRow.date}>
                        <TableCell component="th" scope="row">
                          {historyRow.date}
                        </TableCell>
                        <TableCell>{historyRow.jobTitle}</TableCell>
                        <TableCell align="right">{historyRow.phone}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
}

export default function ProjectContent() {
  const [obj, setObj] = useState(null);
  const [user, setUser] = useState({});
  const [projectInfo, setProjectInfo] = useState({});
  const classes = useRowStyles();
  const history = useHistory();
  const { id } = useParams();

  const goBack = () => {
    history.goBack();
  };

  const fetchContentData = async () => {
    const contentResult = await axios(
      "http://localhost:9000/projects/" + id + "/content"
    );
    setObj(contentResult.data);
  };

  useEffect(() => {
    fetchContentData();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const _id = localStorage.getItem("_id");
      const resultUser = await axios("http://localhost:9000/users/" + _id);
      setUser(resultUser.data);
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchProjectInfoData = async () => {
      const projectInfoResult = await axios(
        "http://localhost:9000/projects/" + id
      );
      setProjectInfo(projectInfoResult.data);
    };
    fetchProjectInfoData();
  }, [id]);

  function deleteData(id) {
    axios
      .delete(
        "http://localhost:9000/projects/" +
          projectInfo._id +
          "/content/delete/" +
          id
      )
      .then((result) => {
        fetchContentData();
        window.location.reload();
      });
  }

  function modifyData(activityId, newDate) {
    axios
      .post(
        "http://localhost:9000/projects/" +
          projectInfo._id +
          "/content/update/" +
          activityId,
        newDate
      )
      .then((result) => {
        fetchContentData();
        window.location.reload();
      });
  }

  function addData(newDate) {
    axios
      .post(
        "http://localhost:9000/projects/" + projectInfo._id + "/content/add",
        newDate
      )
      .then((result) => {
        console.log(result);
        fetchContentData();
        // window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <h2>
      <Header />
      <br />
      <div
        style={{
          paddingLeft: "5%",
          paddingRight: "5%",
        }}
      >
        {obj?.length === 0 ? (
          <h3>Proiectul nu are continut</h3>
        ) : (
          <>
            <h3> {projectInfo.description} </h3>
            <br />
          </>
        )}
        <TableContainer component={Paper}>
          <Table className={classes.spacing} aria-label="collapsible table">
            <TableHead>
              <TableRow>
                {/* &nbsp; */}
                <TableCell />
                <TableCell align="left">Numar</TableCell>
                <TableCell align="left">Document</TableCell>
                <TableCell align="left">Entitate</TableCell>
                <TableCell align="left">Contact</TableCell>
                <TableCell align="left">Procedura</TableCell>
                <TableCell align="left">Plati</TableCell>
                <TableCell align="left">Status/Events</TableCell>
                <TableCell align="left">Operatii</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {obj?.map((item, index) => (
                <Row
                  key={item._id}
                  number={index + 1}
                  row={item}
                  deleteFunction={deleteData}
                  modifyFunction={modifyData}
                  addFunction={addData}
                  okId={item._id}
                  projectInfo={projectInfo}
                  user={user}
                  last={false}
                />
              ))}
              <Row
                row={{
                  firstName: "",
                  lastName: "",
                  companyName: "",
                  catchPhrase: "",
                  teamMembers: [],
                }}
                deleteFunction={deleteData}
                modifyFunction={modifyData}
                addFunction={addData}
                okId={null}
                projectInfo={projectInfo}
                user={user}
                last={true}
              ></Row>
            </TableBody>
          </Table>
        </TableContainer>

        {/* {showWindowPortal !== false && (
          // <MyWindowPortal>
            <UpdateForm
              show={setShowWindowPortal}
              forAdd={adding}
              forUpdate={updating}
              modifyFunction={modifyUser}
              addFunction={addUser}
              okId={thisId}
            />
          // </MyWindowPortal>
        )} */}
      </div>
      <br />
      <div className="d-flex flex-row">
        <div className="p-2">
          <button className="btn btn-primary btn-block" onClick={goBack}>
            Inapoi
          </button>
        </div>
      </div>
    </h2>
  );
}
