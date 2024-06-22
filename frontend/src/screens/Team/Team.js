import React from "react";
import { Table } from "reactstrap";
import "../../assets/css/Profile.css";
import "../../assets/css/tableRoundHeader.css";

function Team(props) {
  return (
    <Table
      // bordered
      hover
      borderless
      responsive
      // striped
      className="tableViewClient"
      style={{ width: "80%", marginTop: "15px" }}
    >
      <thead>
        <tr className="logsHeader Text16N1">
          <th className="tableBody">Employee name</th>
          <th className="tableBody">AVG Hrs/Day</th>
          <th className="tableBody">On Time Arrival</th>
        </tr>
      </thead>
      <tbody
        className="Text12"
        style={{
          textAlign: "center",
          borderWidth: '1px 1px 1px 1px',
          // background: "#EFF0F5",
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8].map(() => (
          <>
            <div style={{ marginTop: "15px" }} />
            <tr
              style={{
                background: "#EFF0F5",
                borderRadius: "8px",
              }}
            >
              <td
                style={{
                  paddingTop: "25px",
                  paddingBottom: "25px",
                }}
                className="tableBody Text14Semi primary2"
              >
                Jatin
              </td>
              <td
                className="tableBody Text14Semi primary2"
                style={{
                  paddingTop: "25px",
                  paddingBottom: "25px",
                }}
              >
                9h 12m{" "}
              </td>
              <td
                className="tableBody Text14Semi primary2"
                style={{
                  paddingTop: "25px",
                  paddingBottom: "25px",
                }}
              >
                100%{" "}
              </td>
            </tr>
          </>
        ))}
      </tbody>
    </Table>
  );
}

export default Team;
