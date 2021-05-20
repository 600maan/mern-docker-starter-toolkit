import React from "react";
import "../../layout/style.css";

export default function register() {
  return (
    <div className="form-register">
      <form>
        <div className="font-size-md text-dark mb-5">Create Your Account</div>
        <div className="form-group mb-2">
          <label for="username-rt" className="sr-only">
            Username
          </label>
          <input
            id="username-rt"
            type="text"
            className="form-control"
            placeholder="Username"
          />
        </div>
        <div className="form-group mb-2">
          <label for="email" className="sr-only">
            Email
          </label>
          <input
            id="email"
            type="text"
            className="form-control"
            placeholder="Email Address"
          />
        </div>
        <div className="form-group mb-2">
          <label for="password-rt" className="sr-only">
            Username
          </label>
          <input
            id="password-rt"
            type="password"
            className="form-control"
            placeholder="Password"
          />
        </div>
        <div className="form-group mb-3">
          <label for="r-password" className="sr-only">
            Username
          </label>
          <input
            id="r-password"
            type="password"
            className="form-control"
            placeholder="Retype password"
          />
        </div>
        <div className="form-group mb-8">
          <div className="custom-control custom-checkbox">
            <input
              type="checkbox"
              className="custom-control-input"
              id="check-term"
            />
            <label className="custom-control-label text-dark" for="check-term">
              You agree with our Terms Privacy Policy and
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary btn-block font-weight-bold text-uppercase font-size-lg rounded-sm"
        >
          Create an account
        </button>
      </form>
    </div>
  );
}
