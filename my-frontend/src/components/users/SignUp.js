import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BackgroundImage from "../../images/BackgroundImage.jpg";
const strongRegex = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
);
const lengthRegex = new RegExp("^(?=.{8,})");
const upperLetterRegex = new RegExp("^(?=.*[A-Z])");
const lowerLetterRegex = new RegExp("^(?=.*[a-z])");
const numberRegex = new RegExp("^(?=.*[0-9])");
const specialCaracterRegex = new RegExp("(?=.*[!@#$%^&*.,;:?'`])");

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      username: "",
      email: "",
      password: "",
      error: "",
      isError: false,
      hasLengthColor: "red",
      containUpperLetterColor: "red",
      containLowewrLetterColor: "red",
      containNumberColor: "red",
      containSpecialCaracterLetter: "red",
    };
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value,
    });
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value,
    });
  }

  onChangePassword(e) {
    if (lengthRegex.test(e.target.value))
      this.setState({ hasLengthColor: "#4eff00" });
    else this.setState({ hasLengthColor: "red" });
    if (upperLetterRegex.test(e.target.value))
      this.setState({ containUpperLetterColor: "#4eff00" });
    else this.setState({ containUpperLetterColor: "red" });
    if (lowerLetterRegex.test(e.target.value))
      this.setState({ containLowewrLetterColor: "#4eff00" });
    else this.setState({ containLowewrLetterColor: "red" });
    if (numberRegex.test(e.target.value))
      this.setState({ containNumberColor: "#4eff00" });
    else this.setState({ containNumberColor: "red" });
    if (specialCaracterRegex.test(e.target.value))
      this.setState({ containSpecialCaracterLetter: "#4eff00" });
    else this.setState({ containSpecialCaracterLetter: "red" });

    this.setState({
      password: e.target.value,
    });
  }

  analyze(value) {
    if (strongRegex.test(value)) {
      return true;
    } else {
      return false;
    }
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.analyze(this.state.password)) {
      const user = {
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
      };

      console.log(user);

      axios
        .post("http://localhost:9000/users/register", user)
        .then((res) => {
          console.log(res.data);
          alert(
            "Solicitarea de inregistrarea a fost trimisa administratorului.Vefi fi notificat ulterior pe email"
          );
          window.location = "/";
        })
        .catch((error) => {
          this.setState({
            error: error.response.data,
            isError: true,
          });
        });
    } else {
      this.setState({
        error: "Parola nu respecta regulile impuse",
        isError: true,
      });
    }
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
                <h3>Inregistrare</h3>

                <div className="form-group">
                  <label>Nume de utilizator</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Introduceti numele de utilizator"
                    required
                    value={this.state.username}
                    onChange={this.onChangeUsername}
                  />
                </div>

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
                  Inregistrare
                </button>

                <p className="forgot-password text-right">
                  Deja inregistrat? <Link to="/">Logare</Link>
                </p>
                <div className="form-group">
                  <strong> Parola trebuie sa contina: </strong>
                  <ul>
                    <li style={{ color: this.state.hasLengthColor }}>
                      Minim 8 caractere
                    </li>
                    <li
                      style={{
                        color: this.state.containLowewrLetterColor,
                      }}
                    >
                      Cel putin o litera mica
                    </li>
                    <li
                      style={{
                        color: this.state.containUpperLetterColor,
                      }}
                    >
                      Cel putin o litera mare
                    </li>
                    <li style={{ color: this.state.containNumberColor }}>
                      Cel putin o cifra
                    </li>
                    <li
                      style={{
                        color: this.state.containSpecialCaracterLetter,
                      }}
                    >
                      Cel putin un semn de punctuatie
                    </li>
                  </ul>
                </div>
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
