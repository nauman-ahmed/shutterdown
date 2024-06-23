import React, { useEffect, useState } from 'react';
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
import { getPreWeds, updateDeliverable } from '../../API/Deliverables';
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";


function PreWedDeliverables() {

  const [editors, setEditors] = useState(null);
  const [allDeliverables, setAllDeliverables] = useState(null);
  const [filterBy, setFilterBy] = useState(null)
  const currentUser = JSON.parse(Cookies.get('currentUser'));
  const [deliverablesForShow, setDeliverablesForShow] = useState(null);
  const [ascendingWeding, setAscendingWeding] = useState(true);
 
  const filterOptions = currentUser?.rollSelect === 'Manager' ? [
    {
      title: 'Assigned Editor',
      id: 1,
      filters: editors && [...editors?.map((editor, i) => {
        return { title: editor.firstName, id: i + 2 }
      }),{ title: 'Unassigned Editor', id: editors.length+3 }]
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
    },
  ]

    // Define priority for parentTitle
    const priority = {
      "Assigned Editor": 1,
      'Current Status': 2
    };

  const applySorting = (wedding = false)=>{
    try {
      if(wedding){
        setDeliverablesForShow(deliverablesForShow.sort((a, b) => {
          const dateA = new Date(a.clientDeadline);
          const dateB = new Date(b.clientDeadline);
          return ascendingWeding ? dateB - dateA : dateA - dateB;
        }));
        setAscendingWeding(!ascendingWeding)
      }
    } catch (error) {
      console.log("applySorting ERROR",error)
    }
  }

  const changeFilter = (filterType) => {
    if (filterType !== filterBy) {
      if (filterType === 'Unassigned Editor') {
        setDeliverablesForShow(allDeliverables.filter(deliverable => !deliverable.editor))
      } else {
        if(filterType !== 'Wedding Date sorting' && filterType !== 'Deadline sorting'){
          setDeliverablesForShow(allDeliverables)
        }
      }
    }
    setFilterBy(filterType);
  }

  const [updatingIndex, setUpdatingIndex] = useState(null);


  const fetchData = async () => {
    try {
      const data = await getPreWeds();
      const res = await getEditors();
      setEditors(res.editors);
      if (currentUser?.rollSelect === 'Manager') {
        setAllDeliverables(data)
        setDeliverablesForShow(data)
      } else if (currentUser?.rollSelect === 'Editor') {
        const deliverablesToShow = data.filter(deliverable => deliverable?.editor?._id === currentUser._id);
        setAllDeliverables(deliverablesToShow);
        setDeliverablesForShow(deliverablesToShow);
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const applyFilterNew = (filterValue) => { 
    if(filterValue.length){
      let conditionDeliverable = null
      let conditionEditor = null
      let conditionStatus = null
      filterValue.map((obj) => {
        if(obj.parentTitle == "Deliverable"){
          conditionDeliverable = conditionDeliverable ? conditionDeliverable + " || deliverable.deliverableName === '" + obj.title + "'" : "deliverable.deliverableName === '" + obj.title + "'"
        }else if(obj.parentTitle == "Assigned Editor"){
          if(obj.title === 'Unassigned Editor'){
            conditionEditor = conditionEditor ? conditionEditor + " || deliverable.editor ? false : true" : "deliverable.editor ? false : true"
          }else{
            conditionEditor = conditionEditor ? conditionEditor + " || deliverable.firstName === '" + obj.title + "'" : " deliverable.firstName === '" + obj.title + "'"
          }
        }else if(obj.parentTitle == "Current Status"){
          conditionStatus = conditionStatus ? conditionStatus + " || deliverable.status === '" + obj.title + "'" : " deliverable.status === '" + obj.title + "'"
        }
      })
      let finalCond = null
      if(conditionDeliverable){
        if(conditionEditor){
          if(conditionStatus){
            finalCond = "(" + conditionDeliverable + ")" + " && " + "(" + conditionEditor +")" + " && " + "(" + conditionStatus + ")"
          }else{
            finalCond = "(" + conditionDeliverable + ")" + " && " + "(" + conditionEditor +")" 
          }
        }else{
          finalCond = "(" + conditionDeliverable + ")" 
        }
      }else if(conditionEditor){
        if(conditionStatus){
          finalCond = "(" + conditionEditor +")" + " && " + "(" + conditionStatus + ")"
        }else{
          finalCond = "(" + conditionEditor +")" 
        }
      }else{
        finalCond = "(" + conditionStatus +")" 
      }
      console.log(finalCond);
      const newData = allDeliverables.filter(deliverable => eval(finalCond))
      setDeliverablesForShow(newData)
    }else{
      setDeliverablesForShow(allDeliverables)
    }
  }

  const applyFilter = (filterValue) => {
    setDeliverablesForShow(null)
    if(filterValue == null){
      setDeliverablesForShow(allDeliverables)
      return
    }
    if (filterBy === 'Assigned Editor') {
      filterValue === 'Any' ? setDeliverablesForShow(allDeliverables.filter(deliverable => deliverable.editor ? true : false)) 
      : filterValue === 'Unassigned Editor' ?
      setDeliverablesForShow(allDeliverables.filter(deliverable => !deliverable.editor))
      : setDeliverablesForShow(allDeliverables.filter(deliverable => deliverable.editor?.firstName === filterValue))
    } else if (filterBy === 'Current Status') {
      filterValue === 'Any' ? setDeliverablesForShow(allDeliverables) : setDeliverablesForShow(allDeliverables.filter(deliverable => deliverable.status === filterValue))
    } else if (filterBy === 'Deadline sorting') {
      let sortedArray;
      if (filterValue === 'No Sorting') {
        sortedArray = [...deliverablesForShow]; // Create a new array
      } else {
        sortedArray = [...deliverablesForShow].sort((a, b) => {
          const dateA = new Date(a.clientDeadline);
          const dateB = new Date(b.clientDeadline);
          return filterValue === 'Ascending' ? dateA - dateB : dateB - dateA;
        });
      }
      setDeliverablesForShow([...sortedArray]);
    } else if (filterBy === 'Wedding Date sorting') {
      console.log(filterValue);
      let sortedArray;
      if (filterValue === 'No Sorting') {
        sortedArray = [...deliverablesForShow]; // Create a new array
      } else {
        sortedArray = [...deliverablesForShow].sort((a, b) => {
          const dateA = new Date(a.clientDeadline).setDate(new Date(a?.clientDeadline).getDate() - 45);
          const dateB = new Date(b.clientDeadline).setDate(new Date(b?.clientDeadline).getDate() - 45);
          return filterValue === 'Ascending' ? dateA - dateB : dateB - dateA;
        });
      }
      setDeliverablesForShow([...sortedArray]);
    }
  }
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



  const handleSaveData = async (index) => {
    try {
      const deliverable = allDeliverables[index];
      setUpdatingIndex(index);
      await updateDeliverable(deliverable)
      setUpdatingIndex(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ClientHeader selectFilter={changeFilter} currentFilter={filterBy} priority={priority} applyFilter={applyFilterNew} options={filterOptions} filter title="Pre-Wedding" />
      {deliverablesForShow ? (
        <>
        
          <div style={{ overflowX: 'hidden', width: '100%' }}>
            <Table
              hover
              bordered
              responsive
              className="tableViewClient"
              style={currentUser.rollSelect === 'Manager' ? { width: '120%', marginTop: '15px' } : { width: '100%', marginTop: '15px' }}
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
                  :currentUser?.rollSelect === 'Manager' ?
                    <tr className="logsHeader Text16N1">
                      <th className="tableBody sticky-column">Client</th>
                      <th className="tableBody">Deliverables</th>
                      <th className="tableBody">Editor</th>
                      <th className="tableBody" style={{cursor:"pointer"}} onClick={(() => applySorting(true))}>Wedding <br/> Date {ascendingWeding ? <IoIosArrowRoundDown style={{color : '#666DFF'}}  className="fs-4 cursor-pointer" /> : <IoIosArrowRoundUp style={{color : '#666DFF'}} className="fs-4 cursor-pointer" /> }</th>
                      <th className="tableBody">Client Deadline</th>
                      <th className="tableBody">Editor Deadline</th>
                      <th className="tableBody">First Delivery Date</th>
                      <th className="tableBody">Final Delivery Date</th>
                      <th className="tableBody">Status</th>
                      <th className="tableBody">Client Revisions</th>
                      <th className="tableBody">Client Ratings</th>
                      <th className="tableBody">Save</th>
                    </tr>
                  :null
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
                              width:"10%"
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
                              width:"10%"
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
                              width:"10%"
                            }}  >
                            {dayjs(new Date(deliverable?.clientDeadline).setDate(new Date(deliverable?.clientDeadline).getDate() - 45)).format('DD-MMM-YYYY')}
                          </td>
                          <td
                            className="tableBody Text14Semi primary2 tablePlaceContent"
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                              width:"10%"
                            }}
                          >
                            {dayjs(deliverable?.clientDeadline).format('DD-MMM-YYYY')}
                          </td>
                          <td
                            className="tableBody Text14Semi primary2 tablePlaceContent"
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                              width:"10%"
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
                              min={deliverable?.clientDeadline ? dayjs(deliverable.clientDeadline).format('YYYY-MM-DD') : ''}
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
                            />
                          </td>
                          <td
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                              width:"10%"
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
                            width: '10%',
                          }} className="tableBody">
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
                            width: '10%',
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
                            style={{
                              paddingTop: '15px',
                              paddingBottom: '15px',
                              width:"20%"
                            }}
                            className="tableBody Text14Semi primary2 tablePlaceContent"   >
                            {dayjs(deliverable?.companyDeadline).format('YYYY-MMM-DD')}
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

export default PreWedDeliverables;
