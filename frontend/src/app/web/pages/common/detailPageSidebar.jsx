import React from "react";
import "../../layout/style.css";

export default function detailPageSidebar() {
  return (
    <div className="widget map mb-6 position-relative mb-6 rounded-0">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.3234892664295!2d114.1673731149547!3d22.303602385321796!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x340401636222796b%3A0xcf54c45744f7ed0f!2sThe%20Jungle!5e0!3m2!1sen!2snp!4v1599223349535!5m2!1sen!2snp"
        width="100%"
        height="450"
        frameborder="0"
        style={{ border: 0 }}
        allowfullscreen=""
        aria-hidden="false"
        tabindex="0"
      ></iframe>
      <div className="button-direction position-absolute">
        <a href="#" className="btn btn-sm btn-icon-left">
          <i className="fas fa-location-arrow"></i>
          Get Direction
        </a>
      </div>
      <div className="card p-4 widget border-0 infomation pt-0 bg-gray-06">
        <div className="card-body px-0 py-2">
          <ul className="list-group list-group-flush">
            <li className="list-group-item bg-transparent d-flex text-dark px-0">
              <span className="item-icon mr-3">
                <i className="fal fa-map-marker-alt"></i>
              </span>
              <span className="card-text">
                Shop no.3, G/F, 273-275 Temple Street, Po Fat Building, Yau Ma
                Tei, Jordan, Yau Ma Te
              </span>
            </li>
            <li className="list-group-item bg-transparent d-flex text-dark px-0">
              <span className="item-icon mr-3">
                <svg className="icon icon-telephone">
                  <use xlinkHref="#icon-telephone"></use>
                </svg>
              </span>
              <span className="card-text">+852 2602 3636</span>
            </li>
            <li className="list-group-item bg-transparent d-flex text-dark px-0">
              <span className="item-icon mr-3">
                <i className="fal fa-globe"></i>
              </span>
              <span className="card-text">
                <a href="https://www.thejunglehk.com/">thejunglehk.com/</a>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
