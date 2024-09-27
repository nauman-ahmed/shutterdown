import React, { useEffect, useRef, useState } from 'react';
import { Table } from 'reactstrap';
import '../../assets/css/Profile.css';
import Heart from '../../assets/Profile/Heart.svg';
import '../../assets/css/tableRoundHeader.css';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from 'dayjs';
import { getEditors } from '../../API/userApi';
import Select from 'react-select';
import Cookies from 'js-cookie';
import ClientHeader from '../../components/ClientHeader';
import { getPhotos, updateDeliverable, getAllTheDeadline } from '../../API/Deliverables';
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";
import { useDispatch } from 'react-redux';
import { GrPowerReset } from "react-icons/gr";
import CalenderImg from "../../assets/Profile/Calender.svg";
import CalenderMultiListView from '../../components/CalendarFilterListView';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Decemeber']

function Photos() {

  const [editors, setEditors] = useState(null);
  const [allDeliverables, setAllDeliverables] = useState(null);
  const [filterBy, setFilterBy] = useState(null)
  const currentUser = JSON.parse(Cookies.get('currentUser'));
  const [deliverablesForShow, setDeliverablesForShow] = useState(null);
  const [updatingIndex, setUpdatingIndex] = useState(null);
  const [ascendingWeding, setAscendingWeding] = useState(true);
  const [filterCondition, setFilterCondition] = useState(null);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [deadlineDays, setDeadlineDays] = useState([]);
  const [dateForFilter, setDateForFilter] = useState(null)
  const [monthForData, setMonthForData] = useState(months[new Date().getMonth()])
  const [yearForData, setYearForData] = useState(new Date().getFullYear())
  const [show, setShow] = useState(false);
  const toggle = () => {
    setShow(!show);
  };
  const target = useRef(null);

  const fetchData = async () => {
    try {
      const data = await getPhotos(1, monthForData, yearForData, dateForFilter);

      const res = await getEditors();
      const deadline = await getAllTheDeadline();
      setDeadlineDays(deadline[0])
      setEditors(res.editors.filter(user => user.subRole.includes('Photo Editor')))
      if (currentUser?.rollSelect === 'Manager') {
        setAllDeliverables(data.data)
        setDeliverablesForShow(data.data)
      } else if (currentUser?.rollSelect === 'Editor') {
        const deliverablesToShow = data.data.filter(deliverable => deliverable?.editor?._id === currentUser._id);
        setAllDeliverables(deliverablesToShow);
        setDeliverablesForShow(deliverablesToShow);
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    setHasMore(true)
    setPage(2)
    fetchData()
  }, [monthForData, yearForData, dateForFilter])
  const fetchPhotos = async () => {
    if (hasMore) {
      setLoading(true);
      try {
        const data = await getPhotos(page, monthForData, yearForData, dateForFilter);
        console.log(data);

        if (data.data.length > 0) {
          let dataToAdd;
          if (currentUser?.rollSelect === "Manager") {
            setAllDeliverables([...allDeliverables, ...data.data])
            if (filterCondition) {
              dataToAdd = data.data.filter(deliverable => eval(filterCondition))
            } else {
              dataToAdd = data.data
            }
            setDeliverablesForShow([...deliverablesForShow, ...dataToAdd]);
          } else if (currentUser.rollSelect === "Editor") {
            const deliverablesToShow = data.data.filter(
              (deliverable) => deliverable?.editor?._id === currentUser._id
            );
            setAllDeliverables([...allDeliverables, ...deliverablesToShow]);
            if (filterCondition) {
              dataToAdd = deliverablesForShow.filter(deliverable => eval(filterCondition))
            } else {
              dataToAdd = deliverablesToShow
            }
            setDeliverablesForShow([
              ...deliverablesForShow,
              ...dataToAdd,
            ]);
          }
        }
        if (data.hasMore) {
          setPage(page + 1);
        }
        setHasMore(data.hasMore);

      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (deliverablesForShow?.length < 10 && hasMore && !loading) {
      fetchPhotos()
    }
  }, [deliverablesForShow, hasMore, loading]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScroll = () => {
    const bottomOfWindow =
      document.documentElement.scrollTop + window.innerHeight >=
      document.documentElement.scrollHeight - 10;

    if (bottomOfWindow) {
      console.log("at bottom");
      fetchPhotos();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const applyFilterNew = (filterValue) => {
    if (filterValue.length) {
      let conditionDeliverable = null
      let conditionEditor = null
      let conditionStatus = null
      filterValue.map((obj) => {
        if (obj.parentTitle == "Deliverable") {
          conditionDeliverable = conditionDeliverable ? conditionDeliverable + " || deliverable.deliverableName === '" + obj.title + "'" : "deliverable.deliverableName === '" + obj.title + "'"
        } else if (obj.parentTitle == "Assigned Editor") {
          if (obj.title === 'Unassigned Editor') {
            conditionEditor = conditionEditor ? conditionEditor + " || deliverable.editor ? false : true" : "deliverable.editor ? false : true"
          } else {
            conditionEditor = conditionEditor ? conditionEditor + " || deliverable.editor?.firstName === '" + obj.title + "'" : " deliverable.editor?.firstName === '" + obj.title + "'"
          }
        } else if (obj.parentTitle == "Current Status") {
          conditionStatus = conditionStatus ? conditionStatus + " || deliverable.status === '" + obj.title + "'" : " deliverable.status === '" + obj.title + "'"
        }
      })
      let finalCond = null
      if (conditionDeliverable) {
        if (conditionEditor) {
          if (conditionStatus) {
            finalCond = "(" + conditionDeliverable + ")" + " && " + "(" + conditionEditor + ")" + " && " + "(" + conditionStatus + ")"
          } else {
            finalCond = "(" + conditionDeliverable + ")" + " && " + "(" + conditionEditor + ")"
          }
        } else if (conditionStatus) {
          finalCond = "(" + conditionDeliverable + ")" + " && " + "(" + conditionStatus + ")"
        } else {
          finalCond = "(" + conditionDeliverable + ")"
        }
      } else if (conditionEditor) {
        if (conditionStatus) {
          finalCond = "(" + conditionEditor + ")" + " && " + "(" + conditionStatus + ")"
        } else {
          finalCond = "(" + conditionEditor + ")"
        }
      } else {
        finalCond = "(" + conditionStatus + ")"
      }
      setFilterCondition(finalCond)
      const newData = allDeliverables.filter(deliverable => eval(finalCond))
      setDeliverablesForShow(newData)
    } else {
      setDeliverablesForShow(allDeliverables)
    }
  }

  // const applyFilter = (filterValue) => {
  //   setDeliverablesForShow(null)
  //   if(filterValue == null){
  //     setDeliverablesForShow(allDeliverables)
  //     return
  //   }
  //   if (filterBy === 'Assigned Editor') {
  //     filterValue === 'Any' ? setDeliverablesForShow(allDeliverables.filter(deliverable => deliverable.editor ? true : false)) 
  //     : filterValue === 'Unassigned Editor' ?
  //     setDeliverablesForShow(allDeliverables.filter(deliverable => !deliverable.editor))
  //     : setDeliverablesForShow(allDeliverables.filter(deliverable => deliverable.editor?.firstName === filterValue))
  //   } else if (filterBy === 'Current Status') {
  //     filterValue === 'Any' ? setDeliverablesForShow(allDeliverables) : setDeliverablesForShow(allDeliverables.filter(deliverable => deliverable.status === filterValue))
  //   } else if (filterBy === 'Deadline sorting') {
  //     let sortedArray;
  //     if (filterValue === 'No Sorting') {
  //       sortedArray = [...deliverablesForShow]; // Create a new array
  //     } else {
  //       sortedArray = [...deliverablesForShow].sort((a, b) => {
  //         const dateA = new Date(a.clientDeadline);
  //         const dateB = new Date(b.clientDeadline);
  //         return filterValue === 'Ascending' ? dateA - dateB : dateB - dateA;
  //       });
  //     }
  //     setDeliverablesForShow([...sortedArray]);
  //   }else if (filterBy === 'Wedding Date sorting') {
  //     console.log(filterValue);
  //     let sortedArray;
  //     if (filterValue === 'No Sorting') {
  //       sortedArray = [...deliverablesForShow]; // Create a new array
  //     } else {
  //       sortedArray = [...deliverablesForShow].sort((a, b) => {
  //         const dateA = new Date(a.clientDeadline).setDate(new Date(a?.clientDeadline).getDate() - 45);
  //         const dateB = new Date(b.clientDeadline).setDate(new Date(b?.clientDeadline).getDate() - 45);
  //         return filterValue === 'Ascending' ? dateA - dateB : dateB - dateA;
  //       });
  //     }
  //     setDeliverablesForShow([...sortedArray]);
  //   }
  // }
  const customStyles = {
    option: (defaultStyles, state) => ({
      ...defaultStyles,
      color: state.isSelected ? "white" : "black",
      backgroundColor: state.isSelected ? "rgb(102, 109, 255)" : "#EFF0F5",
    }),
    control: (defaultStyles) => ({
      ...defaultStyles,
      backgroundColor: "#EFF0F5",
      padding: "2px",
      border: "none",
    }),
    singleValue: (defaultStyles) => ({ ...defaultStyles, color: "#666DFF" }),
  };

  const applySorting = (wedding = false) => {
    try {
      if (wedding) {
        setDeliverablesForShow(deliverablesForShow.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return ascendingWeding ? dateB - dateA : dateA - dateB;
        }));
        setAscendingWeding(!ascendingWeding)
      }
    } catch (error) {
      console.log("applySorting ERROR", error)
    }
  }

  const filterOptions = currentUser?.rollSelect === 'Manager' ? [
    {
      title: 'Assigned Editor',
      id: 1,
      filters: editors && [...editors?.map((editor, i) => {
        return { title: editor.firstName, id: i + 2 }
      }), { title: 'Unassigned Editor', id: editors.length + 3 }]
    },
    {
      title: 'Current Status',
      id: 5,
      filters: [
        {
          title: 'Yet to Start',
          id: 2
        },
        {
          title: 'In Progress',
          id: 3
        },
        {
          title: 'Completed',
          id: 4
        },
      ]
    },
  ] : [
    {
      title: 'Current Status',
      id: 5,
      filters: [
        {
          title: 'Yet to Start',
          id: 2
        },
        {
          title: 'In Progress',
          id: 3
        },
        {
          title: 'Completed',
          id: 4
        },
      ]
    }
  ]

  // Define priority for parentTitle
  const priority = {
    "Assigned Editor": 1,
    'Current Status': 2
  };

  const changeFilter = (filterType) => {
    if (filterType !== filterBy) {
      if (filterType === 'Unassigned Editor') {
        setDeliverablesForShow(allDeliverables.filter(deliverable => !deliverable.editor))
      } else {
        if (filterType !== 'Wedding Date sorting' && filterType !== 'Deadline sorting') {
          setDeliverablesForShow(allDeliverables)
        }
      }
    }
    setFilterBy(filterType);
  }
  const dispatch = useDispatch()

  const handleSaveData = async (index) => {
    try {
      const deliverable = allDeliverables[index];
      setUpdatingIndex(index);
      await updateDeliverable(deliverable)
      setUpdatingIndex(null);
      dispatch({
        type: "SOCKET_EMIT_EVENT",
        payload: {
          event: "add-notification",
          data: {
            notificationOf: "Photos Deliverable",
            data: deliverable,
            forManager: false,
            forUser: deliverable?.editor._id,
            read: false,
            dataId: deliverable._id,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getrelevantDeadline = (title) => {
    if (title == "Photos") {
      return deadlineDays.photo
    }

    return 45
  }


  return (
    <>
      <ClientHeader selectFilter={changeFilter} currentFilter={filterBy} priority={priority} applyFilter={applyFilterNew} options={filterOptions} filter title="Photos" />
      {deliverablesForShow ? (
        <>
          <div className='widthForFilters d-flex flex-row  mx-auto align-items-center' style={{
          }} ref={target}>

            <div className='w-100 d-flex flex-row align-items-center'>
              <div className='w-75 '>
                <div
                  className={`forminput R_A_Justify1`}
                  style={{ cursor: 'pointer' }}
                >

                  {dateForFilter
                    ? dayjs(dateForFilter).format("DD-MMM-YYYY")
                    : <>{monthForData}  {yearForData}</>}
                  <div className="d-flex align-items-center" style={{ position: 'relative' }}>
                    <img alt="" src={CalenderImg} onClick={toggle} />
                    <GrPowerReset
                      className="mx-1"
                      onClick={() => {
                        setDateForFilter(null)
                        setMonthForData(months[new Date().getMonth()])
                        setYearForData(new Date().getFullYear())
                      }}
                    />
                    {show && (

                      <div style={{ width: "300px", position: 'absolute', top: '30px', right: '-10px', zIndex: 1000 }}>
                        <div >
                          <CalenderMultiListView monthForData={monthForData} dateForFilter={dateForFilter}  yearForData={yearForData} setShow={setShow} setMonthForData={setMonthForData} setYearForData={setYearForData} setDateForFilter={setDateForFilter} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div style={{ overflowX: 'hidden', width: '100%' }}>
            <Table
              hover
              bordered
              responsive
              className="tableViewClient"
              style={currentUser.rollSelect === 'Manager' ? { width: '150%', marginTop: '15px' } : { width: '100%', marginTop: '15px' }}
            >
              <thead>
                {currentUser?.rollSelect === 'Editor' ?
                  <tr className="logsHeader Text16N1">
                    <th className="tableBody">Client</th>
                    <th className="tableBody">Deliverables</th>
                    <th className="tableBody">Editor</th>
                    <th className="tableBody">Editor Deadline</th>
                    <th className="tableBody">Status</th>
                  </tr>
                  : currentUser?.rollSelect === 'Manager' ?
                    <tr className="logsHeader Text16N1">
                      <th className="tableBody sticky-column">Client</th>
                      <th className="tableBody">Deliverables</th>
                      <th className="tableBody">Editor</th>
                      <th className="tableBody" style={{ cursor: "pointer" }} onClick={(() => applySorting(true))}>Wedding <br /> Date {ascendingWeding ? <IoIosArrowRoundDown style={{ color: '#666DFF' }} className="fs-4 cursor-pointer" /> : <IoIosArrowRoundUp style={{ color: '#666DFF' }} className="fs-4 cursor-pointer" />}</th>
                      <th className="tableBody">Client Deadline</th>
                      <th className="tableBody">Editor Deadline</th>
                      <th className="tableBody">First Delivery Date</th>
                      <th className="tableBody">Final Delivery Date</th>
                      <th className="tableBody">Status</th>
                      <th className="tableBody">Client Revisions</th>
                      <th className="tableBody">Client Ratings</th>
                      <th className="tableBody">Save</th>
                    </tr>
                    :
                    null
                }
              </thead>
              <tbody
                className="Text12"
                style={{
                  textAlign: 'center',
                  borderWidth: '0px 1px 0px 1px',
                }}
              >
                {deliverablesForShow?.map((deliverable, index) => {
                  return (
                    <>
                      {index === 0 && <div style={{ marginTop: '15px' }} />}
                      {currentUser?.rollSelect === 'Manager' && (
                        <tr
                          style={{
                            background: '#EFF0F5',
                            borderRadius: '8px',
                          }}
                        >
                          <td
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }}
                            className="tableBody Text14Semi sticky-column primary2 tablePlaceContent"
                          >
                            {deliverable?.client?.brideName}
                            <br />
                            <img alt='' src={Heart} />
                            <br />
                            {deliverable.client?.groomName}
                          </td>
                          <td
                            className="tableBody Text14Semi primary2 tablePlaceContent"
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }}
                          >
                            <div>
                              {deliverable.deliverableName}
                            </div>
                          </td>
                          <td
                            className="tableBody Text14Semi primary2 tablePlaceContent"
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }} >

                            <Select value={deliverable?.editor ? { value: deliverable?.editor.firstName, label: deliverable?.editor?.firstName } : null} name='editor' onChange={(selected) => {
                              const updatedDeliverables = [...allDeliverables];
                              updatedDeliverables[index].editor = selected.value;
                              setAllDeliverables(updatedDeliverables)
                            }} styles={customStyles} options={editors?.map(editor => {
                              return ({ value: editor, label: editor.firstName })
                            })} required />
                          </td>
                          <td
                            className="tableBody Text14Semi primary2 tablePlaceContent"
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }}  >
                            {dayjs(deliverable?.date).format('DD-MMM-YYYY')}
                          </td>
                          <td
                            className="tableBody Text14Semi primary2 tablePlaceContent"
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }}
                          >
                            {dayjs(new Date(deliverable?.date).setDate(new Date(deliverable?.date).getDate() + getrelevantDeadline(deliverable.deliverableName))).format('DD-MMM-YYYY')}
                          </td>
                          <td
                            className="tableBody Text14Semi primary2 tablePlaceContent"
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }}
                          >
                            <input
                              type="date"
                              name="companyDeadline"
                              className="dateInput"
                              onChange={(e) => {
                                const updatedDeliverables = [...allDeliverables]
                                updatedDeliverables[index].companyDeadline = e.target.value;
                                setAllDeliverables(updatedDeliverables);
                              }}
                              value={deliverable?.companyDeadline ? dayjs(deliverable?.companyDeadline).format('YYYY-MM-DD') : null}
                              min={deliverable?.date ? dayjs(deliverable?.date).format('YYYY-MM-DD') : ''}
                            />
                          </td>
                          <td
                            className="tableBody Text14Semi primary2 tablePlaceContent"
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }}
                          >

                            <input
                              type="date"
                              name="firstDeliveryDate"
                              className="dateInput"
                              onChange={(e) => {
                                const updatedDeliverables = [...allDeliverables]
                                updatedDeliverables[index].firstDeliveryDate = e.target.value;
                                setAllDeliverables(updatedDeliverables);
                              }}
                              value={deliverable?.firstDeliveryDate ? dayjs(deliverable?.firstDeliveryDate).format('YYYY-MM-DD') : null}
                              min={deliverable?.date ? dayjs(deliverable?.date).format('YYYY-MM-DD') : ''}
                            />
                          </td>
                          <td
                            className="tableBody Text14Semi primary2 tablePlaceContent"
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }}>

                            <input
                              type="date"
                              name="finalDeliveryDate"
                              className="dateInput"
                              onChange={(e) => {
                                const updatedDeliverables = [...allDeliverables]
                                updatedDeliverables[index].finalDeliveryDate = e.target.value;
                                setAllDeliverables(updatedDeliverables);
                              }}
                              value={deliverable?.finalDeliveryDate ? dayjs(deliverable?.finalDeliveryDate).format('YYYY-MM-DD') : null}
                              min={deliverable?.date ? dayjs(deliverable?.date).format('YYYY-MM-DD') : ''}
                            />
                          </td>
                          <td
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }}
                            className="tableBody Text14Semi primary2 tablePlaceContent"   >
                            <Select value={deliverable?.status ? { value: deliverable?.status, label: deliverable?.status } : null} name='Status' onChange={(selected) => {
                              const updatedDeliverables = [...allDeliverables];
                              updatedDeliverables[index].status = selected.value;
                              setAllDeliverables(updatedDeliverables)
                            }} styles={customStyles} options={[
                              { value: 'Yet to Start', label: 'Yet to Start' },
                              { value: 'In Progress', label: 'In Progress' },
                              { value: 'Completed', label: 'Completed' }]} required />
                          </td>

                          <td style={{
                            paddingTop: '15px',
                            paddingBottom: '15px',
                          }} className="tableBody tablePlaceContent">
                            {' '}
                            <Select value={deliverable?.clientRevision ? { value: deliverable?.clientRevision, label: deliverable?.clientRevision } : null} name='clientRevision' onChange={(selected) => {
                              const updatedDeliverables = [...allDeliverables];
                              updatedDeliverables[index].clientRevision = selected.value;
                              setAllDeliverables(updatedDeliverables)
                            }} styles={customStyles} options={[
                              { value: 1, label: 1 },
                              { value: 2, label: 2 },
                              { value: 3, label: 3 },
                              { value: 4, label: 4 },
                              { value: 5, label: 5 },
                              { value: 6, label: 6 },
                            ]} required />
                          </td>
                          <td style={{
                            paddingTop: '15px',
                            paddingBottom: '15px',
                          }} className="tableBody tablePlaceContent">
                            {' '}
                            <Select value={deliverable?.clientRating ? { value: deliverable?.clientRating, label: deliverable?.clientRating } : null} name='clientRating' onChange={(selected) => {
                              const updatedDeliverables = [...allDeliverables];
                              updatedDeliverables[index].clientRating = selected.value;
                              setAllDeliverables(updatedDeliverables)
                            }} styles={customStyles} options={[
                              { value: 1, label: 1 },
                              { value: 2, label: 2 },
                              { value: 3, label: 3 },
                              { value: 4, label: 4 },
                              { value: 5, label: 5 }]} required />
                          </td>
                          <td
                            className="tableBody Text14Semi primary2 tablePlaceContent"
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }} >
                            <button className="btn btn-primary "
                              onClick={(e) => updatingIndex === null && handleSaveData(index)} >
                              {updatingIndex === index ? (
                                <div className='w-100'>
                                  <div class="smallSpinner mx-auto"></div>
                                </div>
                              ) : (
                                "Save"
                              )}
                            </button>
                          </td>
                        </tr>
                      )}
                      {currentUser?.rollSelect === 'Editor' && (
                        <tr
                          style={{
                            background: '#EFF0F5',
                            borderRadius: '8px',
                          }}
                        >
                          <td
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }}
                            className="tableBody Text14Semi primary2 tablePlaceContent"
                          >
                            {deliverable?.client?.brideName}
                            <br />
                            <img alt='' src={Heart} />
                            <br />
                            {deliverable?.client?.groomName}
                          </td>
                          <td className="tableBody Text14Semi primary2 tablePlaceContent"
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }} >
                            <div>
                              {deliverable?.deliverableName} : {deliverable?.quantity}
                            </div>
                          </td>
                          <td
                            className="tableBody Text14Semi primary2 tablePlaceContent"
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }} >
                            {deliverable?.editor?.firstName}
                          </td>
                          <td
                            className="tableBody Text14Semi primary2 tablePlaceContent"
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }} >
                            {deliverable?.companyDeadline}
                          </td>
                          <td
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                            }}
                            className="tableBody Text14Semi primary2 tablePlaceContent"   >
                            {deliverable?.status}
                          </td>
                        </tr>
                      )}
                      <div style={{ marginTop: '15px' }} />
                    </>
                  )
                }
                )}
              </tbody>
            </Table>
            {loading && (
              <div className="d-flex my-3 justify-content-center align-items-center">
                <div class="spinner"></div>
              </div>
            )}
            {!hasMore && (
              <div className="d-flex my-3 justify-content-center align-items-center">
                <div>No more data to load.</div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div style={{ height: '400px' }} className='d-flex justify-content-center align-items-center'>
          <div class="spinner"></div>
        </div>
      )}
    </>
  );
}

export default Photos;
