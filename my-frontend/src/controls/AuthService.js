import * as moment from "moment";

export default class AuthService {
  static setLocalStorage(responseObj) {
    const expiresAt = moment().add(
      Number.parseInt(responseObj.expiresIn),
      "days"
    );

    localStorage.setItem("id_token", responseObj.token);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
    localStorage.setItem("_id", responseObj._id);
  }

  static logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("_id");
    window.location = "/";
  }

  static isLoggedIn() {
    return moment().isBefore(this.getExpiration(), "second");
  }

  static isLoggedOut() {
    return !this.isLoggedIn();
  }

  static getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    if (expiration) {
      const expiresAt = JSON.parse(expiration);
      return moment(expiresAt);
    } else {
      return moment();
    }
  }
}
