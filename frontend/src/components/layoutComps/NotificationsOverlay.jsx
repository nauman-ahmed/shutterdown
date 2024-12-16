import React, { useEffect, useState } from 'react'
import { useLoggedInUser } from '../../config/zStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getUserNotifications } from '../../API/notifictions';
import dayjs from 'dayjs';
import { updateNotifications } from '../../redux/notificationsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Overlay, Tooltip } from 'react-bootstrap';
import { removeId } from '../../functions/general';
import NotiSelect from "../../assets/Profile/NotiSelect.svg";

export default function NotificationsOverlay({ showNoti, setShowNoti, targetNoti }) {
    const { userData: currentUser } = useLoggedInUser();
    const { data: notificationsRes, mutate, isLoading, error } = useMutation({
        mutationKey: ['notifications'],
        mutationFn: () => getUserNotifications(currentUser),
        retry: 1
    })
    const [notiTab, setNotiTab] = useState("1");
    const notifications = useSelector((state) => state.notifications);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const setUserNotifications = async () => {
        // mutate()
        const uniqueData = notificationsRes?.filter((item, index, self) =>
            index === self.findIndex((t) => JSON.stringify(removeId(t)) === JSON.stringify(removeId(item)))
        );

        const todayNotifications = uniqueData?.filter(
            (noti) =>
                dayjs(noti.date).format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD")
        );

        const previousNotifications = uniqueData?.filter(
            (noti) =>
                dayjs(noti.date).format("YYYY-MM-DD") !== dayjs().format("YYYY-MM-DD")
        );
        dispatch(
            updateNotifications({
                today: todayNotifications,
                previous: previousNotifications,
            })
        );
    };

    useEffect(()=>{
        mutate()
    }, [])

    useEffect(() => {
        try {
            setUserNotifications()
        } catch (error) {
            console.log(error);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notificationsRes]);

    return (
        <Overlay
            rootClose={true}
            onHide={() => setShowNoti(false)}
            target={targetNoti.current}
            show={showNoti}
            placement="bottom"

        >
            {(props) => (
                <Tooltip id="overlay-example" {...props}>
                    <div style={{ width: "420px" }}>
                        <div className="nav_Noti_popover Text18S white">
                            <div>Notifications</div>
                        </div>
                        <div className="R_A_Justify tabsNotiDay">
                            <div
                                className={
                                    notiTab === "1"
                                        ? "Text16N1 activeNotiTab point"
                                        : "Text16N1 point"
                                }
                                onClick={() => setNotiTab("1")}
                            >
                                Today
                            </div>
                            <div
                                className={
                                    notiTab === "2"
                                        ? "Text16N1 activeNotiTab point"
                                        : "Text16N1 point"
                                }
                                onClick={() => setNotiTab("2")}
                            >
                                Previous
                            </div>
                        </div>
                        <div className="line" />
                        {notiTab === "1" && (
                            <div style={{ maxHeight: "300px", overflow: "scroll" }}>
                                {notifications?.today?.map((notification, index) => (
                                    <div className="notificationsBox mt12 R_A_Justify" style={{ maxHeight: "300px" }}>
                                        {notification.forManager
                                            ? !notification.readBy.includes(currentUser._id) && (
                                                <div className="Circle" />
                                            )
                                            : !notification.read && <div className="Circle" />}

                                        <div>

                                            <p className="text-black my-auto">
                                                {dayjs(notification.date).format("DD-MMM-YYYY")}
                                            </p>
                                        </div>
                                        <div style={{ textAlign: "left" }}>
                                            <div className="Text14Semi">
                                                New {notification.notificationOf}
                                                <br />
                                                <text className="gray">
                                                    {(notification.notificationOf === "client" || notification.notificationOf === 'Pre-Wed Shoot')
                                                        ? notification.data.brideName +
                                                        " Weds " +
                                                        notification.data.groomName
                                                        : ""}
                                                    {notification.notificationOf === "event"
                                                        ? notification.data.client?.brideName +
                                                        " Weds " +
                                                        notification.data.client?.groomName
                                                        : ""}
                                                </text>
                                            </div>
                                        </div>
                                        <div className="line" style={{ height: "40px" }} />

                                        <img
                                            className=" cursor-pointer"
                                            onClick={() => {
                                                if (notification.forManager) {
                                                    if (
                                                        !notification.readBy.includes(currentUser._id)
                                                    ) {
                                                        dispatch({
                                                            type: "SOCKET_EMIT_EVENT",
                                                            payload: {
                                                                event: "read-notification",
                                                                data: {
                                                                    ...notification,
                                                                    readBy: [
                                                                        ...notification.readBy,
                                                                        currentUser._id,
                                                                    ],
                                                                },
                                                            },
                                                        });
                                                    }
                                                } else {
                                                    if (!notification.read) {
                                                        dispatch({
                                                            type: "SOCKET_EMIT_EVENT",
                                                            payload: {
                                                                event: "read-notification",
                                                                data: {
                                                                    ...notification,
                                                                    read: true,
                                                                },
                                                            },
                                                        });
                                                    }
                                                }

                                                notification.notificationOf === 'client' ? navigate('/MyProfile/Client/ViewClient') : notification.notificationOf === 'event' ? navigate(currentUser?.rollSelect === 'Manager' ? '/MyProfile/Calender/ListView' : '/MyProfile/Deliverables/Cinematography') : notification.notificationOf === 'Pre-Wed Shoot' ? navigate(currentUser?.rollSelect === 'Manager' ? '/MyProfile/PreWedShoot/PreWedShootScreen' : '/MyProfile/Deliverables/PreWed-Deliverables') : notification.notificationOf === 'Cinema Deliverable' ? navigate('/MyProfile/Deliverables/Cinematography') : notification.notificationOf === 'Photos Deliverable' ? navigate('/MyProfile/Deliverables/Photos') : notification.notificationOf === 'Albums Deliverable' ? navigate('/MyProfile/Deliverables/Albums') : notification.notificationOf === 'Pre-Wed Deliverable' ? navigate('/MyProfile/Deliverables/PreWed-Deliverables') : navigate("/")
                                                setShowNoti(false)
                                            }}
                                            alt=""
                                            src={NotiSelect}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                        {notiTab === "2" && (
                            <div style={{ maxHeight: "300px", overflow: "scroll" }}>
                                {notifications?.previous?.map((notification, index) => (
                                    <div className="notificationsBox mt12 R_A_Justify" >
                                        {notification.forManager
                                            ? !notification.readBy.includes(currentUser._id) && (
                                                <div className="Circle" />
                                            )
                                            : !notification.read && <div className="Circle" />}

                                        <div>
                                            {/* <img alt="" src={CalenderNoti} /> */}
                                            <p className="text-black my-auto">
                                                {dayjs(notification.date).format("DD-MMM-YYYY")}
                                            </p>
                                        </div>
                                        <div style={{ textAlign: "left" }}>
                                            <div className="Text14Semi">
                                                New {notification.notificationOf}
                                                <br />
                                                <text className="gray">
                                                    {(notification.notificationOf === "client" || notification.notificationOf === 'Pre-Wed Shoot')
                                                        ? notification.data.brideName +
                                                        " Weds " +
                                                        notification.data.groomName
                                                        : ""}
                                                    {notification.notificationOf === "event"
                                                        ? notification.data.client?.brideName +
                                                        " Weds " +
                                                        notification.data.client?.groomName
                                                        : ""}
                                                </text>
                                            </div>
                                        </div>
                                        <div className="line" style={{ height: "40px" }} />
                                        <div style={{ textAlign: "left" }}>
                                            <div className="Text14Semi">
                                                Location
                                                <br />
                                                <text className="gray">
                                                    {notification?.notificationOf === "client"
                                                        ? notification?.data?.events[0]?.location
                                                        : ""}{" "}
                                                    {notification?.notificationOf === "event"
                                                        ? notification?.data?.location
                                                        : ""}{" "}
                                                </text>
                                            </div>
                                        </div>
                                        <img className="cursor-pointer" onClick={() => {
                                            if (notification.forManager) {
                                                if (
                                                    !notification.readBy.includes(currentUser._id)
                                                ) {
                                                    dispatch({
                                                        type: "SOCKET_EMIT_EVENT",
                                                        payload: {
                                                            event: "read-notification",
                                                            data: {
                                                                ...notification,
                                                                readBy: [
                                                                    ...notification.readBy,
                                                                    currentUser._id,
                                                                ],
                                                            },
                                                        },
                                                    });
                                                }
                                            } else {
                                                if (!notification.read) {
                                                    dispatch({
                                                        type: "SOCKET_EMIT_EVENT",
                                                        payload: {
                                                            event: "read-notification",
                                                            data: {
                                                                ...notification,
                                                                read: true,
                                                            },
                                                        },
                                                    });
                                                }
                                            }

                                            notification.notificationOf === 'client' ? navigate('/MyProfile/Client/ViewClient') : notification.notificationOf === 'event' ? navigate('/MyProfile/Calender/ListView') : notification.notificationOf === 'Pre-Wed Shoot' ? navigate('/MyProfile/PreWedShoot/PreWedShootScreen') : notification.notificationOf === 'Cinema Deliverable' ? navigate('/MyProfile/Deliverables/Cinematography') : notification.notificationOf === 'Photos Deliverable' ? navigate('/MyProfile/Deliverables/Photos') : notification.notificationOf === 'Albums Deliverable' ? navigate('/MyProfile/Deliverables/Albums') : notification.notificationOf === 'Pre-Wed Deliverable' ? navigate('/MyProfile/Deliverables/PreWed-Deliverables') : navigate("/")
                                            setShowNoti(false)
                                        }} alt="" src={NotiSelect} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </Tooltip>
            )}
        </Overlay>
    )
}
