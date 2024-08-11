import React, { useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import "../../assets/css/Profile.css";

function ParticularClient(props) {
  const [selected, setSelectedTab] = useState(1);
  const { clientId } = useParams()
  const navigate = useNavigate();

  let Data3 = [
    {
      title: "Client info",
      link: "ClientInfo/" + clientId,
      id: 1,
    },
    {
      title: "Shoot Details",
      link: "ShootDetails/" + clientId,
      id: 2,
    },
    {
      title: "Deliverables",
      link: "Deliverable/" + clientId,
      id: 3,
    },
  ];

  return (
    <div>
      <div
        className="bottomBox padding_leftSmall rowalign ViewClientParticular"
        style={{ marginBottom: "20px" }}
      >
        <div className="d-flex justify-content-between ViewClientParticularContent">
          {Data3?.map((i, value) => (
            <div
              style={{
                height: 20,
                cursor: "pointer",
                paddingTop: i.id === 3 ? "5px" : "10px",
              }}
              onClick={() => {
                navigate(i.link);
                setSelectedTab(i.id);
              }}
            >
              <div
                key={i.id}
                className={
                  i.id === selected
                    ? "itemsbox Text12 active_profile_tab activeClient "
                    : "itemsbox Text12 non_active_profile_tab"
                }
              >
                {i.title}
              </div>

              {i.id === selected ? (
                <img alt=""
                  src="/images/focus_arrow.png"
                  width={15}
                  style={{ paddingTop: "5px" }}
                  className="focus_arrow"
                />
              ) : (
                ""
              )}
            </div>
          ))}
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default ParticularClient;
