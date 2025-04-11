import React from "react";
import { Table } from "reactstrap";
import "../../assets/css/Profile.css";
import "../../assets/css/tableRoundHeader.css";

function ChecklistDeliverables(props) {
  // Example data for the table
  const deliverableItems = [
    {
      id: 1,
      client: "Kumar & Priya",
      rawPhotos: "2 Drives",
      box: "Premium Box",
      penDrives: "3 Drives (64GB)",
      frames: "5 Frames (8x10)"
    },
    {
      id: 2,
      client: "Raj & Simran",
      rawPhotos: "3 Drives",
      box: "Signature Box",
      penDrives: "2 Drives (128GB)",
      frames: "3 Frames (12x16)"
    },
    {
      id: 3,
      client: "Arjun & Meera",
      rawPhotos: "1 Drive",
      box: "Classic Box",
      penDrives: "1 Drive (256GB)",
      frames: "2 Frames (10x12)"
    },
    {
      id: 4,
      client: "Vikram & Neha",
      rawPhotos: "4 Drives",
      box: "Luxury Box",
      penDrives: "4 Drives (32GB)",
      frames: "7 Frames (8x12)"
    },
    {
      id: 5,
      client: "Rohit & Ananya",
      rawPhotos: "2 Drives",
      box: "Elite Box",
      penDrives: "2 Drives (128GB)",
      frames: "4 Frames (11x14)"
    },
    {
      id: 6,
      client: "Amit & Sonia",
      rawPhotos: "3 Drives",
      box: "Premium Box",
      penDrives: "2 Drives (64GB)",
      frames: "6 Frames (8x10)"
    },
    {
      id: 7,
      client: "Karan & Preeti",
      rawPhotos: "2 Drives",
      box: "Signature Box",
      penDrives: "3 Drives (128GB)",
      frames: "5 Frames (10x14)"
    },
    {
      id: 8,
      client: "Varun & Deepika",
      rawPhotos: "1 Drive",
      box: "Classic Box",
      penDrives: "1 Drive (512GB)",
      frames: "3 Frames (12x18)"
    }
  ];

  return (
    <Table
      hover
      borderless
      responsive
      className="tableViewClient"
      style={{ width: "90%", marginTop: "15px" }}
    >
      <thead>
        <tr className="logsHeader Text16N1">
          <th className="tableBody">Client</th>
          <th className="tableBody">Raw Photos</th>
          <th className="tableBody">Box</th>
          <th className="tableBody">Pen Drives</th>
          <th className="tableBody">Frames</th>
        </tr>
      </thead>
      <tbody
        className="Text12"
        style={{
          textAlign: "center",
          borderWidth: '1px 1px 1px 1px',
        }}
      >
        {deliverableItems.map((item) => (
          <React.Fragment key={item.id}>
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
                {item.client}
              </td>
              <td
                className="tableBody Text14Semi primary2"
                style={{
                  paddingTop: "25px",
                  paddingBottom: "25px",
                }}
              >
                {item.rawPhotos}
              </td>
              <td
                className="tableBody Text14Semi primary2"
                style={{
                  paddingTop: "25px",
                  paddingBottom: "25px",
                }}
              >
                {item.box}
              </td>
              <td
                className="tableBody Text14Semi primary2"
                style={{
                  paddingTop: "25px",
                  paddingBottom: "25px",
                }}
              >
                {item.penDrives}
              </td>
              <td
                className="tableBody Text14Semi primary2"
                style={{
                  paddingTop: "25px",
                  paddingBottom: "25px",
                }}
              >
                {item.frames}
              </td>
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </Table>
  );
}

export default ChecklistDeliverables;