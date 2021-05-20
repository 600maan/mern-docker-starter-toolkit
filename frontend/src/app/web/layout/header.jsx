import React from "react";
import "./style.css";
import logoImg from "image/logo.png";
import { Link } from "react-router-dom";
import routeURL from "config/routeURL";

export default function Header() {
  return (
    <header
      id="header"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        padding: "0px 20px",
      }}
      className="main-header header-sticky header-sticky-smart header-style-01 header-float text-uppercase"
    >
      <div className="header-wrapper sticky-area">
        <div className="container container-1720">
          <nav className="navbar navbar-expand-xl">
            <div className="header-mobile d-flex d-xl-none flex-fill justify-content-between align-items-center">
              <div
                className="navbar-toggler toggle-icon"
                data-toggle="collapse"
                data-target="#navbar-main-menu"
              >
                <span></span>
              </div>
              <Link
                to="/"
                className="navbar-brand navbar-brand-mobile"
                href="index.html"
              >
                <img src={logoImg} alt="logo" height="40" />
              </Link>
              <a
                className=""
                href="#search-popup"
                data-gtf-mfp="true"
                data-mfp-options='{"type":"inline","mainClass":"mfp-move-from-top mfp-align-top search-popup-bg","closeOnBgClick":false,"showCloseBtn":false}'
              >
                <i className="far fa-search"></i>
              </a>
              <div className="ml-2">
                <a
                  href="#login-popup"
                  className="link"
                  data-gtf-mfp="true"
                  data-mfp-options='{"type":"inline"}'
                >
                  <button className="btn btn-sm border-secondary btn-round">
                    {" "}
                    Log in
                  </button>
                </a>
              </div>
              <div className=" ml-2 mr-2">
                <a
                  href="#login-popup"
                  className="link"
                  data-gtf-mfp="true"
                  data-mfp-options='{"type":"inline"}'
                >
                  <button className="btn btn-sm border-secondary btn-round">
                    Register
                  </button>
                </a>
              </div>
            </div>
            <div className="collapse navbar-collapse " id="navbar-main-menu">
              <Link
                to="/"
                className="navbar-brand d-none d-xl-block mr-auto"
                href="index.html"
              >
                <img src={logoImg} alt="logo" height="40" />
              </Link>

              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link" href="index.html">
                    Home
                  </a>{" "}
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="demo/food-and-restaurant/home-food-and-restaurant.html"
                  >
                    Food & Beverage
                  </a>{" "}
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="demo/health-and-medical/home-health-and-medical.html"
                  >
                    Helath & Beauty
                  </a>{" "}
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="demo/hotel/home-hotels.html">
                    Tour & Travel
                  </a>{" "}
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="demo/service-finder/home-services-finder.html"
                  >
                    Retailer & Wholesaler{" "}
                  </a>{" "}
                </li>
              </ul>
              <a
                className="mobile-button-search ml-5 d-sm-none"
                href="#search-popup"
                data-gtf-mfp="true"
                data-mfp-options='{"type":"inline","mainClass":"mfp-move-from-top mfp-align-top search-popup-bg","closeOnBgClick":false,"showCloseBtn":false}'
              >
                <i className="far fa-search"></i>
              </a>
              <div className="ml-5 justify-content-end d-sm-none d-xl-flex">
                <div className="header-customize-item ">
                  <a
                    href={routeURL.web.client_login()}
                    className="link"
                    data-gtf-mfp="true"
                    data-mfp-options='{"type":"inline"}'
                  >
                    <button className="btn btn-sm border-secondary btn-round">
                      {" "}
                      Log in
                    </button>
                  </a>
                </div>
                <div className="header-customize-item  ml-5 mr-5">
                  <a
                    href="#login-popup"
                    className="link"
                    data-gtf-mfp="true"
                    data-mfp-options='{"type":"inline"}'
                  >
                    <button className="btn btn-sm border-secondary btn-round">
                      Register
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
