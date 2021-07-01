import React from "react";
import axios from "axios";

export default function ActivateAcount() {
  async function sendData() {
    var splits = window.location.pathname.split("/");
    var token = -1;
    if (splits.length > 0) token = splits[splits.length - 1];

    const resultActivation = await axios(
      "http://localhost:9000/users/activate-account/" + token
    );
    if (resultActivation.data.success) {
      setTimeout(() => {
        alert("Contul userului a fost activat cu succes");
        window.location = "/projects";
      }, 2000);
    }
  }
  return (
    <div className="d-flex flex-row">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button className="btn btn-primary btn-block" onClick={sendData}>
          Activeaza cont
        </button>
      </div>
    </div>
  );
}
