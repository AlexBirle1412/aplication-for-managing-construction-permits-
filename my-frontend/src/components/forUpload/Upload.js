import React from "react";
import FileUpload from "./FileUpload";

const Upload = (props) => {
  return (
    <div className="container mt-4">
      <FileUpload projectInfo={props.projectInfo} />
      <div className="d-flex flex-row">
        <div className="p-2">
          <button
            className="btn btn-primary btn-block"
            onClick={() => {
              var splits = window.location.pathname.split("/");
              splits.pop();
              splits.pop();
              var newPath = splits.join("/");

              window.location = newPath;
            }}
          >
            Inapoi
          </button>
        </div>
      </div>
    </div>
  );
};

export default Upload;
