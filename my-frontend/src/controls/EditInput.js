import React, { useState, useRef } from "react";
import CancelPresentationIcon from "@material-ui/icons/CancelPresentation";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

export default function EditInput(props) {
  const { info, modifyInfo, okId, modifyKey } = props;
  const [value, setValue] = useState(info);
  const [isInEditMode, setIsInEditMode] = useState(false);
  const textInput = useRef(null);

  function changeEditMode() {
    setIsInEditMode(!isInEditMode);
  }

  function unpdateComponentValue() {
    setIsInEditMode(false);
    let objForModify = {
      [modifyKey]: textInput.current.value,
    };
    if (textInput.current.value.length <= 130) {
      setValue(textInput.current.value);
      modifyInfo(okId, objForModify);
    } else
      alert("Textul introdus trebuie sa contina mai putin de 130 caractere");
  }

  function renderEditView() {
    return (
      <div>
        <input type="text" defaultValue={value} ref={textInput} />
        <CancelPresentationIcon
          onClick={changeEditMode}
        ></CancelPresentationIcon>
        <CheckBoxIcon onClick={unpdateComponentValue}></CheckBoxIcon>
      </div>
    );
  }

  function renderDefaultView() {
    return <div onDoubleClick={changeEditMode}>{value}</div>;
  }

  return isInEditMode ? renderEditView() : renderDefaultView();
}
