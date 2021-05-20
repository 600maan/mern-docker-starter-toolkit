import React from "react";
import Login from "./login";
import Register from "./register";
import "../../layout/style.css";

export default function index() {
  return (
    <div id="login-popup" className="mfp-hide">
      <div className="form-login-register">
        <div className="tabs mb-8">
          <ul
            className="nav nav-pills tab-style-01 text-capitalize justify-content-center"
            role="tablist"
          >
            <li className="nav-item">
              <a
                className="nav-link active"
                id="login-tab"
                data-toggle="tab"
                href="#login"
                role="tab"
                aria-controls="login"
                aria-selected="true"
              >
                <h3>Log In</h3>
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                id="register-tab"
                data-toggle="tab"
                href="#register"
                role="tab"
                aria-controls="register"
                aria-selected="false"
              >
                <h3>Register</h3>
              </a>
            </li>
          </ul>
        </div>
        <div className="tab-content">
          <div
            className="tab-pane fade show active"
            id="login"
            role="tabpanel"
            aria-labelledby="login-tab"
          >
            <Login />
          </div>
        </div>
        <div
          className="tab-pane fade "
          id="register"
          role="tabpanel"
          aria-labelledby="register-tab"
        >
          <Register />
        </div>
        <div className="social-icon origin-color si-square">
          <div className="font-size-md text-dark "> Log In With</div>
          <ul className="row no-gutters list-inline text-center">
            <li className="list-inline-item si-facebook col-3">
              <a target="_blank" title="Facebook" href="#">
                <i className="fab fa-facebook-f"></i>
              </a>
            </li>
            <li className="list-inline-item si-google col-3">
              <a target="_blank" title="Google" href="#">
                <i className="fab fa-google"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
