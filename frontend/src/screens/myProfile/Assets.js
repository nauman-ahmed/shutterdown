import React from "react";
import { Col, Row } from "reactstrap";
import "../../assets/css/Profile.css";

function Assets(props) {
  let Data = [
    {
      data1: [
        {
          title: "Adhar Card",
          id: 1,
        },
        {
          title: "PAN Card",
          id: 2,
        },
        {
          title: "Driving License",
          id: 3,
        },
        {
          title: "Voter ID Card",
          id: 4,
        },
        {
          title: "Passport",
          id: 5,
        },
        {
          title: "Photo",
          id: 6,
        },
        {
          title: "Signature",
          id: 7,
        },
      ],
      Title: "Identity Documents",
      id: 1,
      value: 6,
    },
  ];
  return (
    <div style={{ marginBottom: "30px" }}>
      <Row className="W90">
        {Data.map((item) => (
          <Col xs="12" sm="6" key={item.id} className="pr6">
            <div className="profileCard mt40">
              <div className="R_A_Justify p10">
                <div className="Text14Semi">Assets</div>
                <div className="Text10N gray">Edit</div>
              </div>
              <div className="line" />
              <div className="plt12">
                <div className="Text12 gray mt12" style={{ height: "80px" }}>
                  Currently no assets are assigned to you.
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Assets;
