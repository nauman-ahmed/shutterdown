import React from "react";
import { Table } from "reactstrap";
import "../../assets/css/Profile.css";
import Heart from "../../assets/Profile/Heart.svg";
import CoomonDropDown from "../../components/CoomonDropDown";
import RowHeaderDropDown from "../../components/RowHeaderDropDown";
import "../../assets/css/tableRoundHeader.css";

function Reports(props) {
  return (
    <Table
      // bordered
      hover
      borderless
      responsive
      // striped
      className="tableViewClient"
      style={{ width: "100%", marginTop: "15px" }}
    >
      <thead>
        <tr className="logsHeader Text16N1">
          <th className="tableBody">Client:</th>
          <th className="tableBody">Task Assigned</th>
          <th className="tableBody">Task Assigned Date</th>
          <th className="tableBody">Status</th>
          <th className="tableBody">Company Deadline</th>
          <th className="tableBody">Completion Date</th>
          <th className="tableBody">Delay</th>
        </tr>
      </thead>
      <tbody
        className="Text12"
        style={{
          textAlign: "center",
          borderWidth: "0px 1px 0px 1px",
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
                  paddingTop: "15px",
                  paddingBottom: "15px",
                }}
                className="tableBody Text14Semi primary2"
              >
                <RowHeaderDropDown table />
              </td>
              <td
                className="tableBody Text14Semi primary2"
                style={{
                  paddingTop: "15px",
                  paddingBottom: "15px",
                }}
              >
                Long Editied Video Status{" "}
              </td>
              <td
                className="tableBody Text14Semi primary2"
                style={{
                  paddingTop: "15px",
                  paddingBottom: "15px",
                }}
              >
                20-Aug, 2022{" "}
              </td>
              <td
                className="tableBody Text14Semi primary2"
                style={{
                  paddingTop: "15px",
                  paddingBottom: "15px",
                }}
              >
                <CoomonDropDown table Placeholder="In Progress" />
              </td>
              <td
                className="tableBody Text14Semi primary2"
                style={{
                  paddingTop: "15px",
                  paddingBottom: "15px",
                }}
              >
                1-Sep, 2022{" "}
              </td>
              <td
                className="tableBody Text14Semi primary2"
                style={{
                  paddingTop: "15px",
                  paddingBottom: "15px",
                }}
              >
                1-Sep, 2022{" "}
              </td>
              <td
                className="tableBody Text14Semi primary2"
                style={{
                  paddingTop: "15px",
                  paddingBottom: "15px",
                }}
              >
                0{" "}
              </td>
            </tr>
          </>
        ))}
      </tbody>
    </Table>
  );
}

export default Reports;
