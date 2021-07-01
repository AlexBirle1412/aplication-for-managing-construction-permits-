import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DescriptionIcon from "@material-ui/icons/Description";
import { blue } from "@material-ui/core/colors";

function getImage(target, project_id, updateImageFunction) {
  let projectId = project_id;
  axios({
    url:
      "http://localhost:9000/projects/" +
      projectId +
      "/content/get-image/" +
      target,
    method: "GET",
    responseType: "arraybuffer",
  })
    .then((response) => {
      const base64 = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      updateImageFunction("data:;base64," + base64);
    })
    .catch((error) => {
      console.log(error);
    });
}

function ManyColums(data, project_id, updateImage) {
  return data.map((elem, index) => {
    return (
      <Col sm={4} key={index}>
        <br />
        <br />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <button
            className="btn btn-light"
            onClick={(event) => {
              event.preventDefault();
              console.log("apasat");
              getImage(elem.name, project_id, updateImage);
              //fileInputRef.current.click();
            }}
          >
            <DescriptionIcon style={{ fontSize: 120, color: blue[700] }} />
          </button>

          <br />
          <div style={{ textAlign: "center" }}>{elem.name}</div>
        </div>
      </Col>
    );
  });
}

function ModalComponent(props) {
  const { data, project_id } = props;

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (image) {
      setPreview(image);
    } else {
      setPreview(null);
    }
  }, [image]);

  if (!preview)
    return (
      <Modal
        scrollable={true}
        size="lg"
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Selectati imaginea pentru previzualizare
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">
          <Container>
            <Row>{ManyColums(data, project_id, setImage)}</Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  else
    return (
      <Modal
        scrollable={true}
        size="lg"
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Dati click in interiorul imaginii pentru a afisa lista de imagini
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="show-grid">
          <Container>
            <img
              width="900px"
              height="900px"
              alt="In curs de procesare"
              src={preview}
              style={{
                //objectFit: "cover",
                border: "2px solid black",
                marginTop: "5%",
                objectFit: "contain",
              }}
              onClick={() => {
                setImage(null);
              }}
            />
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
}

export default function MydModalWithGrid() {
  const [modalShow, setModalShow] = useState(false);
  const [fileList, setFileList] = useState([]);
  const { projectId } = useParams();

  useEffect(() => {
    const fetchListOfFiles = async () => {
      const resultData = await axios(
        "http://localhost:9000/projects/" + projectId + "/content/get-all-files"
      );
      if (resultData.data.fileInfos)
        setFileList(
          resultData.data.fileInfos.filter((elem) => {
            return elem.isImage === true;
          })
        );
      else setFileList([]);
    };

    fetchListOfFiles();
  }, []);

  return (
    <>
      <button
        className="btn btn-primary btn-block"
        onClick={(event) => {
          event.preventDefault();
          setModalShow(true);

          //fileInputRef.current.click();
        }}
      >
        Previzualizeaza imagini
      </button>

      <ModalComponent
        show={modalShow}
        onHide={() => setModalShow(false)}
        data={fileList}
        project_id={projectId}
      />
    </>
  );
}
