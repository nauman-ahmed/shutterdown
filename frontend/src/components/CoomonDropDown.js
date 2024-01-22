import React, { useState,useEffect } from 'react';
import {
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown,
} from 'reactstrap';
import Bookadd from '../assets/Profile/Bookadd.svg';
import EditBook from '../assets/Profile/EditBook.svg';
import DeleteBook from '../assets/Profile/DeleteBook.svg';
import PropTypes from 'prop-types';
import { sendCinematographerName } from '../API/DeliverableApi';
import dayjs from "dayjs";
import { preWeddingUpdatedData } from '../API/CalenderListViewApi';

function CoomonDropDown({
  direction,
  table = false,
  Placeholder,
  AddEvent,
  DeliverableData1,
  DeliverableData2,
  status,
  revision,
  id,
  noOfAlbums,
  setStatusData,
  setClientRevision,
  setEditorData,
  assigntoString,
  assigntoStringManager,
  assignto,
  assignByString,
  assignBy,
  preWeddingShoot,
  preWedding,
  setPreWedding,
  datas,
  statusData,
  editor,
  CheckListWhatsApp,
  WhatsAppCheckList,
  setWhatsAppCheckList,
  ClientListData,
  CheckListCollection,
  collection,
  setCollection,
  setEventId,
  attendenceSettings,
  attendenceCheck,
  setAttendenceCheck,
  setIsSelected,
  ShooterData,
  setShooterData,
  ShooterId,
  setShooterId,
  AttendenceData,
  AttendenceShooter,
  EditorData,
  assignByStringManager,
  manager,
  defaultName,
  setEditorSelect,
  editorSelect,
  assignBySelect,
  setAssignBySelect,
  editorData,
  userId,
  setDropdownDeliverables,
  eventDate,
  options,
  deliverableEventDataOptionsSelected,
  setDeliverableEventDataOptionsSelected,
  setCompanyId1,
  value,
  valueType,
  cinematographyDataIndex,
  companyId1,
  clientRevision
}) {
  const [isChecked,setIsChecked]=useState(false)
  const [shooterIds,setShooterIds]=useState()
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownSelect, setDropdownSelect] = useState(
    Placeholder || 'Add event'
  );
  let data = ["Yet to Start","In Progress","Completed"]
  let PreWeddingShootTable = ["Yet to Start","In Progress","Completed"]

  let data1 = [
    {
      title: '1',
      id: 1,
    },
    {
      title: '2',
      id: 2,
    },
    {
      title: '3',
      id: 3,
    },
  ];
  const data2 = [
    {
      title: 'Shooter',
      id: '1',
    },
    {
      title: 'Editor',
      id: '2',
    },
  ];

  const toggle = () => {
    setDropdownOpen((prevState) => !prevState);
  };
  const toggle1=()=>{
setDropdownOpen(true)

  }
  let array = [];
const handleCheckedValues=(e,id)=>{
for (let index = 0; index<[id].length; index++) {
 
  array.push(id)
  
}
  setShooterIds(id)

}

useEffect(()=>{
  if(value){
    if(valueType == "text"){
      setDropdownSelect(value)
    }
    else if(valueType == "date"){
      setDropdownSelect(dayjs(value).format('DD-MM-YYYY'))
    }
    else if(valueType == "status"){
      setDropdownSelect(value)
    }
    else if(valueType == "ClientRevision"){
      setDropdownSelect(value)
    }
    else if(valueType == "PreWeddingShootTable"){
      setDropdownSelect(value)
    }
    else if(valueType == "assigntoStringManager"){
      setDropdownSelect(value)
    }
  }
},[value])

const handleCheckedValuesChange=(e,i)=>{
  for (let index = 0; index < e.target.value.length; index++) {
    const element = array[index];
    
    if (i._id) {
      setIsChecked(true)
    }
  }
 
}
  const handleChange = async (i, id) => {
    setDropdownSelect(i.title);

    if (status === 'status') {
      let temp = {...statusData}
      temp[cinematographyDataIndex] = i

      setDropdownSelect(i);
      setStatusData(temp);
      //  await sendCinematographerName(Status);
    } else if (eventDate === 'eventDate') {
      //Client date is associated with the wedding data so we are not taking client date
      let temp = {...deliverableEventDataOptionsSelected}
      temp[cinematographyDataIndex] = i

      setDeliverableEventDataOptionsSelected(temp)
      setDropdownSelect(dayjs(i).format('DD-MM-YYYY'));

    }
    else if (revision === 'revision') {
      let temp = {...clientRevision}
      temp[cinematographyDataIndex] = i

      setClientRevision(temp);
      setDropdownSelect(i);
      // await sendCinematographerName(revisionData)
    } else if (assigntoString === 'assigntoString') {
      setDropdownSelect(i);

    } else if (assignByString === 'assignByString') {
    } else if (preWeddingShoot === 'PreWeddingShoot') {
      // setPreWedding(i)
      await preWeddingUpdatedData(datas, i.title);
    } else if (preWeddingShoot === 'PreWeddingShootTable') {
      setDropdownSelect(i);
      setStatusData(i)
    } else if (editor === 'editor') {
      setDropdownSelect(i);
      setEditorData(i);
      setEventId(id);
      setDropdownSelect(i);
      // sendCinematographerName(editorData);
    } else if (editor === 'deliverables') {
      setDropdownDeliverables(i);
      setDropdownSelect(i);
      // setEventId(id);
      // sendCinematographerName(editorData);
    } else if (editor === 'manager') {

      let temp = {...editorData}
      temp[cinematographyDataIndex] = i
      setDropdownSelect(i);
      setEditorData(temp);

    } else if (CheckListWhatsApp === 'CheCkListWhatsApp') {
      setWhatsAppCheckList(i);
      setDropdownSelect(i);
    } else if (CheckListCollection === 'CheckListCollection') {
      setCollection(i);
      setDropdownSelect(i);
    } else if (attendenceSettings === 'attendenceSettings') {
      setAttendenceCheck(i);
      setDropdownSelect(i);
      setIsSelected(true);
    } else if (AttendenceShooter === 'AttendenceShooter') {
      
      setShooterData(i.firstName);
      setDropdownSelect(i.firstName);
    }
    else if (assigntoStringManager==="assigntoStringManager") {
      setEditorSelect(i)
      setDropdownSelect(i.firstName)
    }
    else if (assignByStringManager==="assignByStringManager") {
      setAssignBySelect(i)
      setDropdownSelect(i)
    }
  };

  const getIcon = (i) => {
    switch (i) {
      case 1:
        return <img src={Bookadd} style={{ marginRight: '10px' }} />;
        break;
      case 2:
        return <img src={EditBook} style={{ marginRight: '10px' }} />;
        break;
      case 3:
        return <img src={DeleteBook} style={{ marginRight: '10px' }} />;
        break;
      default:
        break;
    }
  };
  return (
    <div className="d-flex">
      <ButtonDropdown>
        <Dropdown
          isOpen={dropdownOpen}
          toggle={AttendenceShooter === 'AttendenceShooter' ? toggle1 : toggle}
        >
          <DropdownToggle
            caret
            className={table ? 'DropDownBox tableDropdwn' : 'DropDownBox'}
            defaultValue={defaultName}
          >
            {dropdownSelect}
          </DropdownToggle>

          <DropdownMenu
            className="dropOpenBox"
            style={{ background: '#EFF0F5' }}
            defaultValue={defaultName}
          >
            {status === 'status' ? (
              <>
                {data &&
                  data.map((i) => {
                    const background = dropdownSelect == i.title ? true : false;
                    return (
                      <DropdownItem
                        key={i}
                        onClick={() => handleChange(i)}
                        style={{
                          background: background ? '#666DFF' : '',
                          color: background ? 'white' : '',
                        }}
                      >
                        {/* {AddEvent && getIcon(i.id)} */}
                        {i}
                      </DropdownItem>
                    );
                  })}
              </>
            ) : preWeddingShoot === 'PreWeddingShoot' ? (
              <>
                {data &&
                  data.map((i) => {
                    const background = dropdownSelect == i.title ? true : false;
                    return (
                      <DropdownItem
                        key={i.id}
                        onClick={() => handleChange(i)}
                        style={{
                          background: background ? '#666DFF' : '',
                          color: background ? 'white' : '',
                        }}
                      >
                        {AddEvent && getIcon(i.id)}
                        {i.title}
                      </DropdownItem>
                    );
                  })}
              </>
            )
            : preWeddingShoot === 'PreWeddingShootTable' ? (
              <>
                {PreWeddingShootTable &&
                  PreWeddingShootTable.map((i) => {
                    const background = dropdownSelect == i.title ? true : false;
                    return (
                      <DropdownItem
                        key={i.id}
                        onClick={() => handleChange(i)}
                        style={{
                          background: background ? '#666DFF' : '',
                          color: background ? 'white' : '',
                        }}
                      >
                        {/* {AddEvent && getIcon(i.id)} */}
                        {i}
                      </DropdownItem>
                    );
                  })}
              </>
            )
             : revision === 'revision' ? (
              <>
                <>
                  {data &&
                    data1.map((i) => {
                      const background =
                        dropdownSelect == i.title ? true : false;
                      return (
                        <DropdownItem
                          key={i.id}
                          onClick={() => handleChange(i.title)}
                          style={{
                            background: background ? '#666DFF' : '',
                            color: background ? 'white' : '',
                          }}
                        >
                          {AddEvent && getIcon(i.id)}
                          {i.title}
                        </DropdownItem>
                      );
                    })}
                </>
              </>
            ) : assigntoString === 'assigntoString' ? (
              <>
                {assignto &&
                  assignto.map((i) => {
                    const background =
                      dropdownSelect == i.assignTo.name ? true : false;
                    return (
                      <DropdownItem
                        key={i.id}
                        onClick={() => handleChange(i.assignTo)}
                        style={{
                          background: background ? '#666DFF' : '',
                          color: background ? 'white' : '',
                        }}
                      >
                        {AddEvent && getIcon(i.id)}
                        {i.assignTo.name}
                      </DropdownItem>
                    );
                  })}
              </>
            ) : assigntoStringManager === 'assigntoStringManager' ? (
              <>
                {EditorData &&
                  EditorData.map((i) => {
                    const background =
                      dropdownSelect == i.firstName ? true : false;
                    return (
                      <DropdownItem
                        key={i.id}
                        onClick={() => handleChange(i)}
                        style={{
                          background: background ? '#666DFF' : '',
                          color: background ? 'white' : '',
                        }}
                      >
                        {AddEvent && getIcon(i.id)}
                        {i.firstName}
                      </DropdownItem>
                    );
                  })}
              </>
            ) : assignByStringManager === 'assignByStringManager' ? (
              <>
                {manager &&
                  manager.map((i) => {
                    const background =
                      dropdownSelect == i.firstName ? true : false;
                    return (
                      <DropdownItem
                        key={i.id}
                        onClick={() => handleChange(i.firstName)}
                        style={{
                          background: background ? '#666DFF' : '',
                          color: background ? 'white' : '',
                        }}
                        defaultValue={defaultName}
                      >
                        {AddEvent && getIcon(i.id)}
                        {i.firstName}
                      </DropdownItem>
                    );
                  })}
              </>
            ) : assignByString === 'assignByString' ? (
              <>
                {assignBy &&
                  assignBy.map((i) => {
                    const background =
                      dropdownSelect == i.assignBy.name ? true : false;
                    return (
                      <DropdownItem
                        key={i.id}
                        onClick={() => handleChange(i.assignBy)}
                        style={{
                          background: background ? '#666DFF' : '',
                          color: background ? 'white' : '',
                        }}
                      >
                        {AddEvent && getIcon(i.id)}
                        {i.assignBy.name}
                      </DropdownItem>
                    );
                  })}
              </>
            ) : editor === 'deliverables' ? (
              <>
                {DeliverableData1 &&
                  DeliverableData1.map((i) => {
                    const background =
                      dropdownSelect == i.firstName ? true : false;
                    return (
                      <DropdownItem
                        key={i.id}
                        onClick={() => handleChange(i, i)}
                        style={{
                          background: background ? '#666DFF' : '',
                          color: background ? 'white' : '',
                        }}
                      >
                        {/* {AddEvent && getIcon(i.id)} */}
                        {i}
                      </DropdownItem>
                    );
                  })}
              </>
            ) : editor === 'editor' ? (
              <>
                {DeliverableData1 &&
                  DeliverableData1.map((i) => {
                    const background =
                      dropdownSelect == i.firstName ? true : false;
                    return (
                      <DropdownItem
                        key={i.id}
                        onClick={() => handleChange(i, i)}
                        style={{
                          background: background ? '#666DFF' : '',
                          color: background ? 'white' : '',
                        }}
                      >
                        {/* {AddEvent && getIcon(i.id)} */}
                        {i}
                      </DropdownItem>
                    );
                  })}
              </>
            ) : editor === 'manager' ? (
              <>
                {DeliverableData2 &&
                  DeliverableData2.map((i) => {
                    const background =
                      dropdownSelect == i.firstName ? true : false;
                    return (
                      <DropdownItem
                        key={i.id}
                        onClick={() => handleChange(i.firstName, i)}
                        style={{
                          background: background ? '#666DFF' : '',
                          color: background ? 'white' : '',
                        }}
                      >
                        {/* {AddEvent && getIcon(i.id)} */}
                        {i.firstName}
                      </DropdownItem>
                    );
                  })}
              </>
            ) : attendenceSettings === 'attendenceSettings' ? (
              <>
                {data2 &&
                  data2.map((i) => {
                    const background = dropdownSelect == i.title ? true : false;
                    return (
                      <DropdownItem
                        key={i.id}
                        onClick={() => handleChange(i.title, i._id)}
                        style={{
                          background: background ? '#666DFF' : '',
                          color: background ? 'white' : '',
                        }}
                      >
                        {AddEvent && getIcon(i.id)}
                        {i.title}
                      </DropdownItem>
                    );
                  })}
              </>
            ) : AttendenceShooter === 'AttendenceShooter' ? (
              <>
                {AttendenceData &&
                  AttendenceData.map((i) => {
                    const background = dropdownSelect == i.title ? true : false;
                    return (
                      <DropdownItem
                        key={i.id}
                        // onClick={() => handleChange(i)}
                        style={{
                          background: background ? '#666DFF' : '',
                          color: background ? 'white' : '',
                        }}
                      >
                        {AddEvent && getIcon(i.id)}
                        <input
                          type="checkbox"
                          className=""
                          name="me-3"
                          id=""
                          checked={
                            shooterIds === i._id && isChecked ? true : false
                          }
                          onClick={(e) => handleCheckedValues(e, i._id)}
                          onChange={(e) => handleCheckedValuesChange(e, i)}
                          value={i._id}
                          // value={i._id}
                        />
                        <span className="ms-3">{i.firstName}</span>
                      </DropdownItem>
                    );
                  })}
                <div>
                  <hr />
                  <button
                    className="btn btn-primary"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Save
                  </button>
                </div>
              </>
            ) : CheckListWhatsApp === 'CheCkListWhatsApp' ||
              CheckListCollection === 'CheckListCollection' ? (
              <>
                {ClientListData &&
                  ClientListData.map((i) => {
                    const background = dropdownSelect == i.title ? true : false;
                    return (
                      <DropdownItem
                        key={i.id}
                        onClick={() => handleChange(i.title)}
                        style={{
                          background: background ? '#666DFF' : '',
                          color: background ? 'white' : '',
                        }}
                      >
                        {AddEvent && getIcon(i.id)}
                        {i.title}
                      </DropdownItem>
                    );
                  })}
              </>
            ) 
            : eventDate === 'eventDate' ? (
              <>
                {options &&
                  options.map((i) => {
                    const background = dropdownSelect == i.title ? true : false;
                    return (
                      <DropdownItem
                        key={i.id}
                        onClick={() => handleChange(i)}
                        style={{
                          background: background ? '#666DFF' : '',
                          color: background ? 'white' : '',
                        }}
                      >
                       {dayjs(i).format('DD-MM-YYYY')}
                      </DropdownItem>
                    );
                  })}
              </>
            ) : null}
          </DropdownMenu>
        </Dropdown>
      </ButtonDropdown>
    </div>
  );
}

CoomonDropDown.propTypes = {
  direction: PropTypes.string,
};

export default CoomonDropDown;
