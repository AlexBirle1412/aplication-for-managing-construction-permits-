import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthService from "../../controls/AuthService";
import "../../styles/Login-Register.css";
import BackgroundImage from "../../images/BackgroundImage.jpg";
var myIPAdress = require("../../controls/FindMyLocalIP.js");

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      email: "",
      password: "",
      error: "",
      isError: false,
    };
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value,
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value,
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const user = {
      email: this.state.email,
      password: this.state.password,
    };
    ///TREBUIE SA DAU ADRESA IP DIN RETEAUA LOCALA
    axios
      .post("http://" + myIPAdress + ":9000/users/login", user)
      .then((res) => {
        console.log(res);
        AuthService.setLocalStorage(res.data);
        window.location = "http://localhost:3000/projects";
      })
      .catch((error) => {
        this.setState({
          error: error.response.data.msg,
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
                <h3>Logare</h3>

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

                <div className="form-group">
                  <label>Parola</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Introduceti parola"
                    required
                    value={this.state.password}
                    onChange={this.onChangePassword}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  Logare
                </button>

                <p className="forgot-password text-right">
                  <Link to={"/forgot-password"}>Resetare parola</Link>
                </p>
              </form>
              <br />
              <Link to={"/sign-up"} className="btn btn-primary btn-block">
                Inregistrare
              </Link>
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
