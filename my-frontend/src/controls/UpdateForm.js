import React, { useState } from "react";
import { MDBCard, MDBCardBody, MDBIcon } from "mdbreact";

const mystyle = {
  color: "black",
  fontSize: "20px",
  padding: "10px",
  fontFamily: "Calibri",
};

const initialFValues = {
  document: "",
  entity: "",
  contact: "",
  procedure: "",
  payments: "",
  status: "",
};

export default function UpdateForm(props) {
  const { modifyFunction, addFunction, okId, forAdd, forUpdate } = props;
  const [values, setValues] = useState(initialFValues);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  return (
    <div>
      <br />
      <br />
      <MDBCard>
        <MDBCardBody>
          <form>
            <h1 className="h4 text-center py-4">
              {forAdd
                ? "Introduceti noile informatii"
                : "Actualizati informatiile"}{" "}
            </h1>
            <label
              htmlFor="defaultFormCardDocument"
              className="grey-text font-weight-light"
            >
              <strong style={mystyle}>Document</strong>
            </label>
            <input
              type="text"
              id="defaultFormCardDocument"
              className="form-control"
              name="document"
              value={values.document}
              onChange={handleInputChange}
            />
            <br />

            <label
              htmlFor="defaultFormCardEntity"
              className="grey-text font-weight-light"
            >
              <strong style={mystyle}>Entitate</strong>
            </label>
            <input
              type="text"
              id="defaultFormCardEntity"
              className="form-control"
              name="entity"
              value={values.entity}
              onChange={handleInputChange}
            />
            <br />

            <label
              htmlFor="defaultFormCardContact"
              className="grey-text font-weight-light"
            >
              <strong style={mystyle}>Contact</strong>
            </label>
            <input
              type="text"
              id="defaultFormCardContact"
              className="form-control"
              name="contact"
              value={values.contact}
              onChange={handleInputChange}
            />
            <br />

            <label
              htmlFor="defaultFormCardProcedure"
              className="grey-text font-weight-light"
            >
              <strong style={mystyle}>Procedura</strong>
            </label>
            <input
              type="text"
              id="defaultFormCardProcedure"
              className="form-control"
              name="procedure"
              value={values.procedure}
              onChange={handleInputChange}
            />
            <br />

            <label
              htmlFor="defaultFormCardPayments"
              className="grey-text font-weight-light"
            >
              <strong style={mystyle}>Plati</strong>
            </label>
            <input
              type="text"
              id="defaultFormCardPayments"
              className="form-control"
              name="payments"
              value={values.payments}
              onChange={handleInputChange}
            />

            <label
              htmlFor="defaultFormCardStatus"
              className="grey-text font-weight-light"
            >
              <strong style={mystyle}>Status\Evenimente</strong>
            </label>
            <input
              type="text"
              id="defaultFormCardStatus"
              className="form-control"
              name="status"
              value={values.status}
              onChange={handleInputChange}
            />

            {/* <label
                  htmlFor="defaultFormCardEmailEx"
                  className="grey-text font-weight-light"
                >
                  Your email
                </label>
                <input
                  type="email"
                  id="defaultFormCardEmailEx"
                  className="form-control"
                /> */}
            <div className="text-center py-4 mt-3">
              <button
                className="btn btn-primary btn-block"
                type="submit"
                onClick={() => {
                  if (forUpdate === true) modifyFunction(okId, values);
                  else if (forAdd === true) addFunction(values);
                  else console.log("NICI UPDATE NICI MODIFY");
                  console.log("UPDATE = " + forUpdate);
                  console.log("ADD = " + forAdd);
                  // show(false);
                }}
              >
                Trimite
                <MDBIcon far icon="paper-plane" className="ml-2" />
              </button>
            </div>
          </form>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
}
