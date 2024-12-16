import React from "react";
import BASE_URL from "../API";

export default function MemberCardPDF({ user, role }) {
  return (
    <div className="shootCardBoxPdf mb-5">
      <div className="w-100 image-BoxPdf">
        {user?.photo ? (
          <img
            alt=""
            className="imgRadius w-100 h-100"
            src={BASE_URL + "/" + user?.photo}
          />
        ) : (
          <div className="ProfileBox d-flex justify-content-center align-items-center w-100 h-100 fs-1 p-2">
            {`${user?.firstName.charAt(0).toUpperCase()}${user?.lastName
              .charAt(0)
              .toUpperCase()}`}
          </div>
        )}
      </div>
      <div className="d-flex flex-column gap-2" style={{ padding: "20px" }}>
        <text className="Text20Semi d-block fs-5 fw-bold text-center">
          {/* <text className="w-100 text-center" style={{ color: "#666DFF" }}> */}
          {user?.firstName + " " + user?.lastName}
          {/* </text> */}
        </text>

        <text className=" d-block text-center border border-2 border-secondary designationBoxPdf p-1 border-circle">
          <p className="fs-4 fw-bold mb-0">{role}</p>
        </text>
        <text>
          <h3 className="Text14 text-center" style={{ paddingTop: "15px" }}>
            {user?.About}
          </h3>
        </text>
      </div>
    </div>
  );
}
