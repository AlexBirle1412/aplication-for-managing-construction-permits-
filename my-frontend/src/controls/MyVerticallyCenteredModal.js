import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import UpdateForm from "./UpdateForm";
import AddBoxIcon from "@material-ui/icons/AddBox";
import EditIcon from "@material-ui/icons/Edit";

function ModalComponent(props) {
  const { show, onHide, isForUpdating, okId, modifyFunction, addFunction } =
    props;

  return (
    <Modal
      // {...props}
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Adaugare activitate
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <UpdateForm
          forAdd={!isForUpdating}
          forUpdate={isForUpdating}
          okId={okId}
          modifyFunction={modifyFunction}
          addFunction={addFunction}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default function MyVerticallyCenteredModal(props) {
  const { buttonStyle, isForUpdating, okId, modifyFunction, addFunction } =
    props;
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <Button
        variant="contained"
        className={buttonStyle}
        onClick={(e) => {
          setModalShow(true);
        }}
      >
        {isForUpdating === true ? <EditIcon /> : <AddBoxIcon />}
      </Button>

      <ModalComponent
        show={modalShow}
        onHide={() => setModalShow(false)}
        isForUpdating={isForUpdating}
        modifyFunction={modifyFunction}
        addFunction={addFunction}
        okId={okId}
      />
    </>
  );
}
