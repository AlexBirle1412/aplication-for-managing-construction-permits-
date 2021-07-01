import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BackgroundImage from "../../images/BackgroundImage.jpg";

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      email: "",
      error: "",
      isError: false,
    };
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value,
    });
  }

  onSubmit(e) {
    e.preventDefault();
    let data = {
      email: this.state.email,
    };

    axios
      .post("http://localhost:9000/users/forgot-password", data)
      .then((res) => {
        alert(
          "A fost trimis un email cu instructiuni suplimentare la adresa indicata"
        );
        window.location = "/";
      })
      .catch((error) => {
        this.setState({
          error: error.response.data,
          isError: true,
        });
      });
  }

  render() {
    return (
      <>
        <div
          className="bg-img"
          style={{
            backgroundImage: `url(${BackgroundImage})`,
            minHeight: "100vh",
            /* Center and scale the image nicely */
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div className="auth-wrapper">
            <div className="auth-inner">
              {this.state.isError === true && (
                <h3>
                  <span style={{ textAlign: "center", color: "#DC143C" }}>
                    {this.state.error}
                  </span>
                </h3>
              )}

              <form onSubmit={this.onSubmit}>
                <h3>Resetare parola</h3>

                <div className="form-group">
                  <label>Adresa de email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Introduceti adresa de email"
                    required
                    value={this.state.email}
                    onChange={this.onChangeEmail}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  Trimite email
                </button>

                <p className="forgot-password text-right">
                  Deja inregistrat? <Link to="/">Logare</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
        <h3 style={{ textAlign: "center" }}>
          Bine ati venit! Va rugam sa va autentificati pentru a putea continua.
        </h3>
      </>
    );
  }
}
