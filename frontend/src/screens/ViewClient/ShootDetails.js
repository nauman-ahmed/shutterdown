import React, { useEffect, useState } from "react";
import { Button, Table } from "reactstrap";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import "../../assets/css/Profile.css";
import Heart from "../../assets/Profile/Heart.svg";
import Photo from "../../assets/Profile/Photo.png";
import Photo2 from "../../assets/Profile/Photo2.png";
import dayjs from "dayjs";
import axios from 'axios';
import { getClientAllShootDetails, getClientById } from "../../API/Client"
import { getAllUsers } from "../../API/userApi"
import BASE_URL from "../../API";

function ShootDetails(props) {

  const [clientData, setClientData] = useState(null)
  const [teamView, setTeamView] = useState(false);
  const [teamToShow, setTeamToShow] = useState(null)
  const { clientId } = useParams()

  useEffect(() => {
    getIdData()
  }, [])

  const getIdData = async () => {
    try {
      const res = await getClientById(clientId)
      setClientData(res);
    } catch (error) {
      console.log(error);
    }
  };


  console.log(clientData);
  return (
    <div>
      <div>
        {teamView ? (
          <div className="shootDetailsBox">
            <div
              className="Text24Semi"
              style={{ textAlign: 'center', marginBottom: '15px' }}
            >
              About Team
            </div>
            <div className="shootCardBox">
              <div
                style={{
                  width: '232px',
                  height: '200px',
                }}
              >
                {clientData?.userID?.photo ? (

                  <img className="imgRadius"
                    src={BASE_URL + '/' + clientData?.userID?.photo}
                    style={{
                      width: '232px',
                      height: '200px',
                    }}
                  />
                ) : (
                  <div className="ProfileBox Text50Semi">
                    {`${clientData?.userID?.firstName.charAt(0).toUpperCase()}${clientData?.userID?.lastName.charAt(0).toUpperCase()}`}
                  </div>
                )}
              </div>
              <div style={{ padding: '20px' }}>
                <text className="Text14Semi">
                  Team Leader: <text style={{ color: '#666DFF' }}>{clientData.userID?.firstName + " " + clientData.userID?.lastName}</text>
                </text>
                <br />
                <blockquote>
                  <h3 className="Text12 gray" style={{ paddingTop: '15px' }}>
                    {clientData.userID?.About}
                  </h3>
                </blockquote>
              </div>
            </div>

            {teamToShow?.shootDirector?.length > 0 && teamToShow?.shootDirector?.map((user, ind) =>
              <div className="shootCardBox mt-5">
                <div
                  style={{
                    width: '232px',
                    height: '200px',
                  }}
                >
                  {user?.photo ?
                    <img className="imgRadius"
                      src={BASE_URL + '/' + user.photo}
                      style={{
                        width: '232px',
                        height: '200px',
                      }}
                    />
                    : <div className="ProfileBox Text50Semi">
                      {`${user?.firstName.charAt(0).toUpperCase()}${user?.lastName.charAt(0).toUpperCase()}`}
                    </div>
                  }
                </div>

                <div style={{ padding: '20px' }}>
                  <text className="Text14Semi">
                    Shoot Director: <text style={{ color: '#666DFF' }}>{user.firstName + " " + user.lastName}</text>
                  </text>
                  <br />
                  <blockquote>
                    <h3 className="Text12 gray" style={{ paddingTop: '15px' }}>
                      {user.About}
                    </h3>
                  </blockquote>
                </div>
              </div>
            )}
            {teamToShow?.choosenPhotographers?.length > 0 && teamToShow?.choosenPhotographers?.map((user, ind) =>
              <div className="shootCardBox mt-5">
                <div
                  style={{
                    width: '232px',
                    height: '200px',
                  }}
                >
                  {user?.photo ?
                    <img className="imgRadius"
                      src={BASE_URL + '/' + user.photo}
                      style={{
                        width: '232px',
                        height: '200px',
                      }}
                    />
                    : <div className="ProfileBox Text50Semi">
                      {`${user?.firstName.charAt(0).toUpperCase()}${user?.lastName.charAt(0).toUpperCase()}`}
                    </div>
                  }
                </div>
                <div style={{ padding: '20px' }}>
                  <text className="Text14Semi">
                    Photographer: <text style={{ color: '#666DFF' }}>{user.firstName + " " + user.lastName}</text>
                  </text>
                  <br />
                  <blockquote>
                    <h3 className="Text12 gray" style={{ paddingTop: '15px' }}>
                      {user.About}
                    </h3>
                  </blockquote>
                </div>
              </div>
            )}


            {teamToShow?.choosenCinematographers.length > 0 && teamToShow.choosenCinematographers?.map((user, ind) =>
              <div className="shootCardBox mt-5">
                <div
                  style={{
                    width: '232px',
                    height: '200px',
                  }}
                >
                  {user?.photo ?
                    <img className="imgRadius"
                      src={BASE_URL + '/' + user.photo}
                      style={{
                        width: '232px',
                        height: '200px',
                      }}
                    />
                    : <div className="ProfileBox Text50Semi">
                      {`${user?.firstName.charAt(0).toUpperCase()}${user?.lastName.charAt(0).toUpperCase()}`}
                    </div>
                  }
                </div>

                <div style={{ padding: '20px' }}>
                  <text className="Text14Semi">
                    Cinematographer: <text style={{ color: '#666DFF' }}>{user.firstName + " " + user.lastName}</text>
                  </text>
                  <br />
                  <blockquote>
                    <h3 className="Text12 gray" style={{ paddingTop: '15px' }}>
                      {user.About}
                    </h3>
                  </blockquote>
                </div>

              </div>
            )}
            {teamToShow?.droneFlyers?.length > 0 && teamToShow.droneFlyers?.map((user, ind) =>
              <div className="shootCardBox mt-5">
                <div
                  style={{
                    width: '232px',
                    height: '200px',
                  }}
                >
                  {user?.photo ?
                    <img className="imgRadius"
                      src={BASE_URL + '/' + user.photo}
                      style={{
                        width: '232px',
                        height: '200px',
                      }}
                    />
                    : <div className="ProfileBox Text50Semi">
                      {`${user?.firstName.charAt(0).toUpperCase()}${user?.lastName.charAt(0).toUpperCase()}`}
                    </div>
                  }
                </div>

                <div style={{ padding: '20px' }}>
                  <text className="Text14Semi">
                    Drone Flyer: <text style={{ color: '#666DFF' }}>{user.firstName + " " + user.lastName}</text>
                  </text>
                  <br />
                  <blockquote>
                    <h3 className="Text12 gray" style={{ paddingTop: '15px' }}>
                      {user.About}
                    </h3>
                  </blockquote>
                </div>

              </div>
            )}
            {teamToShow?.manager.length > 0 && teamToShow?.manager?.map((user, ind) =>
              <div className="shootCardBox mt-5">
                <div
                  style={{
                    width: '232px',
                    height: '200px',
                  }}
                >
                  {user?.photo ?
                    <img className="imgRadius"
                      src={BASE_URL + '/' + user.photo}
                      style={{
                        width: '232px',
                        height: '200px',
                      }}
                    />
                    : <div className="ProfileBox Text50Semi">
                      {`${user?.firstName.charAt(0).toUpperCase()}${user?.lastName.charAt(0).toUpperCase()}`}
                    </div>
                  }
                </div>
                <div style={{ padding: '20px' }}>
                  <text className="Text14Semi">
                    Manager: <text style={{ color: '#666DFF' }}>{user.firstName + " " + user.lastName}</text>
                  </text>
                  <br />
                  <blockquote>
                    <h3 className="Text12 gray" style={{ paddingTop: '15px' }}>
                      {user.About}
                    </h3>
                  </blockquote>
                </div>

              </div>
            )}
            {teamToShow?.assistants.length > 0 && teamToShow?.assistants?.map((user, ind) =>
              <div className="shootCardBox mt-5">
                <div
                  style={{
                    width: '232px',
                    height: '200px',
                  }}
                >
                  {user?.photo ?
                    <img className="imgRadius"
                      src={BASE_URL + '/' + user.photo}
                      style={{
                        width: '232px',
                        height: '200px',
                      }}
                    />
                    : <div className="ProfileBox Text50Semi">
                      {`${user?.firstName.charAt(0).toUpperCase()}${user?.lastName.charAt(0).toUpperCase()}`}
                    </div>
                  }
                </div>
                <div style={{ padding: '20px' }}>
                  <text className="Text14Semi">
                    Assistant Name: <text style={{ color: '#666DFF' }}>{user.firstName + " " + user.lastName}</text>
                  </text>
                  <br />
                  <blockquote>
                    <h3 className="Text12 gray" style={{ paddingTop: '15px' }}>
                      {user.About}
                    </h3>
                  </blockquote>
                </div>

              </div>
            )}
            {teamToShow?.sameDayPhotoMakers.length > 0 && teamToShow?.sameDayPhotoMakers?.map((user, ind) =>
              <div className="shootCardBox mt-5">
                <div
                  style={{
                    width: '232px',
                    height: '200px',
                  }}
                >
                  {user?.photo ?
                    <img className="imgRadius"
                      src={BASE_URL + '/' + user.photo}
                      style={{
                        width: '232px',
                        height: '200px',
                      }}
                    />
                    : <div className="ProfileBox Text50Semi">
                      {`${user?.firstName.charAt(0).toUpperCase()}${user?.lastName.charAt(0).toUpperCase()}`}
                    </div>
                  }
                </div>
                <div style={{ padding: '20px' }}>
                  <text className="Text14Semi">
                    Same Day Photo Maker: <text style={{ color: '#666DFF' }}>{user.firstName + " " + user.lastName}</text>
                  </text>
                  <br />
                  <blockquote>
                    <h3 className="Text12 gray" style={{ paddingTop: '15px' }}>
                      {user.About}
                    </h3>
                  </blockquote>
                </div>

              </div>
            )}
            {teamToShow?.sameDayVideoMakers.length > 0 && teamToShow?.sameDayVideoMakers?.map((user, ind) =>
              <div className="shootCardBox mt-5">
                <div
                  style={{
                    width: '232px',
                    height: '200px',
                  }}
                >
                  {user?.photo ?
                    <img className="imgRadius"
                      src={BASE_URL + '/' + user.photo}
                      style={{
                        width: '232px',
                        height: '200px',
                      }}
                    />
                    : <div className="ProfileBox Text50Semi">
                      {`${user?.firstName.charAt(0).toUpperCase()}${user?.lastName.charAt(0).toUpperCase()}`}
                    </div>
                  }
                </div>
                <div style={{ padding: '20px' }}>
                  <text className="Text14Semi">
                    Same Day Video Maker: <text style={{ color: '#666DFF' }}>{user.firstName + " " + user.lastName}</text>
                  </text>
                  <br />
                  <blockquote>
                    <h3 className="Text12 gray" style={{ paddingTop: '15px' }}>
                      {user.About}
                    </h3>
                  </blockquote>
                </div>

              </div>
            )}
          </div>
        ) : (
          <Table bordered hover responsive>
            <thead>
              <tr className="logsHeader Text16N1">
                <th>Client</th>
                <th>Event</th>
                <th>Date</th>
                <th>Location</th>
                <th style={{ whiteSpace: 'nowrap' }}>Team Leader</th>
                <th style={{ whiteSpace: 'nowrap' }}>
                  Photographer
                </th>
                <th style={{ whiteSpace: 'nowrap' }}>
                  Cinematpgrapher
                </th>
                <th style={{ whiteSpace: 'nowrap' }}>
                  Drone Flyer
                </th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody
              className="Text12 primary2"
              style={{
                textAlign: 'center',
                borderWidth: '0px 1px 0px 1px',
                // background: "#EFF0F5",
              }}
            >
              {clientData?.events?.map((event, index) =>
                <tr>
                  <td className="Text14Semi primary2">
                    {clientData.brideName}
                    <br />
                    <img src={Heart} />
                    <br />
                    {clientData.groomName}
                  </td>
                  <td>{event.eventType}</td>
                  <td>{dayjs(event.eventDate).format('YYYY-MM-DD')}</td>
                  <td>{event.location}</td>
                  <td>{clientData.userID && clientData.userID?.firstName + " " + clientData.userID?.lastName}</td>
                  <td>
                    {event.choosenPhotographers?.length > 0 &&
                      <div>
                        {event.choosenPhotographers?.map((photographer, i) => {
                          return (
                            <>{i + 1}. {photographer.firstName + " " + photographer.lastName}
                              <br />
                            </>
                          )
                        })}

                      </div>
                    }
                  </td>
                  <td>
                    {event.choosenCinematographers?.length > 0 &&
                      <div>
                        {event.choosenCinematographers?.map((cinematographer, i) => {
                          return (
                            <>{i + 1}. {cinematographer.firstName + " " + cinematographer.lastName}
                              <br />
                            </>
                          )
                        })}
                      </div>
                    }
                  </td>
                  <td>
                    {event.droneFlyers?.length > 0 &&
                      <div>
                        {event.droneFlyers.map((droneFlyer, i) => {
                          return (
                            <>{i + 1}. {droneFlyer.firstName + " " + droneFlyer.lastName}
                              <br />
                            </>
                          )
                        })}
                      </div>
                    }
                  </td>
                  <td style={{ paddingTop: '30px' }}>
                    <Button
                      className="submit_btn submit shootDetailsBtn"
                      style={{ marginRight: '10px' }}
                      onClick={() => {
                        setTeamView(true);
                        setTeamToShow(event)
                      }}
                    >
                      About the Team
                    </Button>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
}

export default ShootDetails;
