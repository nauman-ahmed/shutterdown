import React, { useState, useEffect } from 'react';
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
import ShootStar from '../assets/Profile/ShootStar.svg';
import PropTypes from 'prop-types';
import { ToastContainer, toast } from 'react-toastify';
import Edit from '../assets/Profile/Edit.svg';

function ShootDropDown(props) {
  const { direction, table = false, Placeholder, AddEvent, getUserApi } = props;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownSelect, setDropdownSelect] = useState('Select');
  const [dropdownValue, setDropdownValue] = useState([]);
  const [shootDirector, setShootDirector] = useState(false);
  const [shootDirectorOpen, setShootDirectorOpen] = useState('Select');
  const [matchedId, setMatchedId] = useState([]);
  const [checkedEmail, setCheckedEmail] = useState([]);
  const [shooterDirector, setShooterDirector] = useState([]);
  const [radioIndex, setRadioIndex] = useState('');
  const [inputIndex, setInputIndex] = useState([]);
  
  useEffect(() => {

    // const data = JSON.parse(localStorage.getItem('clientData'));
    setDropdownValue(props.data);

  }, []);
  

  const toggle = async () => {
    // let data = []
    // await setDropdownValue([])
    // for(let i=0; i<dropdownValue.length ; i++){
    //   for(let j = 0; j<props.data.length;j++){
    //     if(dropdownValue[i]._id == props.data[j].id){
    //       data.push({checked:true,email:dropdownValue[i].email,firstName:dropdownValue[i].firstName,lastName:dropdownValue[i].lastName,password:dropdownValue[i].password,phoneNo:dropdownValue[i].phoneNo,rollSelect:dropdownValue[i].rollSelect,_id:dropdownValue[i]._id})
    //     }else{
    //       data.push({checked:false,email:dropdownValue[i].email,firstName:dropdownValue[i].firstName,lastName:dropdownValue[i].lastName,password:dropdownValue[i].password,phoneNo:dropdownValue[i].phoneNo,rollSelect:dropdownValue[i].rollSelect,_id:dropdownValue[i]._id})
    //     }
    //   }
    // }
    //setDropdownValue(data);
    if (props.check === 'shoot') {
      // props.setShootDirectorOpen_((prevState) => !prevState);
    }
    if (props.check === 'photoGrapher') {
      props.setPhotoGrapherOpen((prevState) => !prevState);
    }
    if (props.check === 'cinematoGrapher') {
      props.setCinematoGrapherOpen((prevState) => !prevState);
    }
    if (props.check === 'droneFlyer') {
      props.setDroneFlyerOpen((prevState) => !prevState);
    }
    if (props.check === 'manager') {
      props.setManagerOpen((prevState) => !prevState);
    }
    if (props.check === 'Assistant') {
      props.setAssistantOpen((prevState) => !prevState);
    }
    if (props.check === 'Photo') {
      props.setPhotoOpen((prevState) => !prevState);
    }
    setDropdownOpen((prevState) => !prevState);
  };

  const handleChange = (i, id) => {
    if (props.shoot === 'shoot') {
      // props.setShootDirector(i);
    }
    if (props.check === 'photoGrapher') {
      props.setPhotoGrapher(i);
    }
    if (props.check === 'cinematoGrapher') {
      props.setCinematoGrapher(i);
    }
    if (props.check === 'droneFlyer') {
      props.setDroneFlyer(i);
    }
    if (props.check === 'manager') {
      props.setManager(i);
    }
    if (props.check === 'Assistant') {
      props.setAssistant(i);
    }
    if (props.check === 'Photo') {
      props.setPhoto(i);
    }

    setDropdownSelect(i);
  };

  const inputCheckbox = (data, index) => {
    let value = 0;
    for(let i = 0; i<dropdownValue.length; i++){
      if(dropdownValue[i].checked == true){
        value ++;
      }
    }
    if ((dropdownValue[index].checked === true)) {
      dropdownValue[index].checked = false;
    } else if ((dropdownValue[index].checked === false)) {
        if(parseInt(props.addLength)>value){
        dropdownValue[index].checked = true;
      }else{
        toast.error('You have already selected your allowed persons');
        return
      }
    } else {
      if(parseInt(props.addLength)>value){
        dropdownValue[index].checked = true;
      }else{
        toast.error('You have already selected your allowed persons');
        return
      }
    }
    
    let tempInputIndex = [...inputIndex]
    tempInputIndex.push(index)
    setInputIndex(tempInputIndex)

    let data_ = {_id:data._id,name:data.firstName+' '+data.lastName,allData:dropdownValue}
    if(props.check == 'photoGrapher'){
      props.selectedPhotographer(data_)
    }
    if(props.check == 'cinematoGrapher'){
      props.selectedCinematographer(data_)
    }
    if(props.check == 'droneFlyer'){
      props.selectedDronFlyer(data_)
    }
    if (props.check === 'Photo') {
      props.selectedPhoto(data_);
    }
    const copy = [...dropdownValue];
  
    setDropdownValue(copy);
    setCheckedEmail(index);
  };

  const radioCheckBox = (data, index) => {

    if(props.check == "shoot"){
      props.selectedDirector({_id:data._id,name:data.firstName+' '+data.lastName,allData:dropdownValue})
    }else{
      let value = 0;
    for(let i = 0; i<dropdownValue.length; i++){
      if(dropdownValue[i].checked == true){
        value ++;
      }
    }
     if (dropdownValue[index].checked === true) {
       dropdownValue[index].checked = false;
     } else if (dropdownValue[index].checked === false) {
      if(parseInt(props.addLength)>value){
        dropdownValue[index].checked = true;
      }else{
        toast.error('You have already selected your allowed persons');
        return
      }
     } else {
      if(parseInt(props.addLength)>value){
        dropdownValue[index].checked = true;
      }else{
        toast.error('You have already selected your allowed persons');
        return
      }
     }
   
     setRadioIndex(index);
    const copy = [...dropdownValue];
    let data_ = {_id:data._id,name:data.firstName+' '+data.lastName,allData:dropdownValue}
    if(props.check == 'shoot'){ 
      props.selectedDirector(data_)
    }
    if(props.check == 'Assistant'){ 
      props.selectedAssistant(data_)
    }
    if(props.check == 'manager'){ 
      props.selectedManager(data_)
    }
    if(props.check == 'Photo'){ 
      props.selectedPhoto(data_)
    }
      setDropdownValue(copy);
      setCheckedEmail(index);
    }

    
  };

  return (
    <div className="d-flex">
        <ToastContainer />

      <ButtonDropdown>
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle
            className={table ? 'DropDownBox tableDropdwn' : 'DropDownBox'}
            style={{
              alignItems: 'center',
              display: 'flex',
            }}
           >
            {
              props?.data?.length==0  ?
            <div style={{whiteSpace:'nowrap'}}>
            <img src={ShootStar} style={{ marginRight: '5px' }} />            
            Select ({props.addLength})
            </div>
            : 
            <div style={{whiteSpace:'nowrap'}}>
            <img src={Edit} /> ({props.addLength})
            </div>
            }

          </DropdownToggle>
        
          <DropdownMenu
            className="dropOpenBox"
            // style={{ background: '#EFF0F5' }}
          >
            {dropdownValue?.map((i, index) => (
              // const background = dropdownSelect == i.firstName ? true : false;
              <DropdownItem
                key={i.id}
                // onClick={() => {handleChange(i.firstName, i._id)}}
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                {i.firstName} {i.lastName}
                {props.check === 'shoot' || props.check === 'manager' || props.check === 'Assistant' ? (
                  <input
                    className='ml-2'
                    type="checkbox"
                    onChange={(e) => {handleChange(i.firstName, i._id);radioCheckBox(i, index)}}
                    // checked={matchedId === true}
                    checked={i.checked === true&&radioIndex===index }
                  />
                ) : (
                  <input
                    className='ml-2'
                    type="checkbox"
                    onChange={(e) => {handleChange(i.firstName, i._id);inputCheckbox(i, index)}}
                    // checked={matchedId === true}
                    checked={i.checked === true && inputIndex.includes(index) }
                  />
                )}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      </ButtonDropdown>
      
    </div>
  );
}



export default ShootDropDown;
