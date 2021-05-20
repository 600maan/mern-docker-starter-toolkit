import React from "react";
import "../../layout/style.css";

export default function login() {
  return (
    <div className="form-login m-t-10">
      <form>
        <div className="font-size-md text-dark mt-5 mb-5">
          Log In Your Account
        </div>
        <div className="form-group mb-2">
          <label for="username" className="sr-only">
            Username
          </label>
          <input
            id="username"
            type="text"
            className="form-control"
            placeholder="Username"
          />
        </div>
        <div className="form-group mb-3">
          <div className="input-group flex-nowrap align-items-center">
            <label for="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              type="text"
              className="form-control"
              placeholder="Password"
            />
            <a href="#" className="input-group-append text-decoration-none">
              Forgot?
            </a>
          </div>
        </div>
        <div className="form-group mb-6">
          <div className="custom-control custom-checkbox">
            <input
              type="checkbox"
              className="custom-control-input"
              id="check"
            />
            <label className="custom-control-label text-dark" for="check">
              Remember
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary btn-block font-weight-bold text-uppercase font-size-lg rounded-sm mb-8"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
