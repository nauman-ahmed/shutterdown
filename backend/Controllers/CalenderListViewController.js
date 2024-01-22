const addClientSchema = require('../models/ClientModel');
const userSchema = require('../models/userSchema');

const preWeddingShootModel = require("../models/PreWeedingShoot");
const ClientEventSchema = require('../models/client_events');
const AddClientSchema = require('../models/ClientModel');
const ClientDeliverablesSchema = require('../models/client_deliverables');
const PreWeddingShootModel = require('../models/PreWeedingShoot');

// console.log(data,"data")
// const finalFilterData = data.filter((filterData, index) => {
//   filterData.events.filter((data) => {
//     // console.log(data,"filterData")
//     data?.photoGrapherName?.map(async (id) => {
//       let idArray = id.id;
//       console.log(idArray, index, 'idArray');
//       const data1 = await addClientSchema.find({
//         'events.photoGrapherName.id': { $eq: idArray },
//       });
//       console.log(data1, 'data1');
//     });
//   });
// });
//  console.log(finalFilterData,"finalFilterData")
//  console.log(data[0].events[0].droneFlyerName,"data")
// data.filter((data)=>{
//   console.log(data.events.filter((filterData)=>{
//     console.log(filterData.droneFlyerName.filter((drone)=>{
//       console.log(drone,"drone")
//     }),"filterData")
//   }),"data")
// })

//
const ClientListViewController = async (req, res) => {
  try {
    const clientEvents = await addClientSchema.find({
      userID: req.params.id,
    });
    const shooterData = await userSchema.find({
      rollSelect: 'Shooter',
    });
    let data = [];
    for (let i = 0; i < shooterData.length; i++) {
      data.push({
        _id: shooterData[i]._id,
        firstName: shooterData[i].firstName,
        lastName: shooterData[i].lastName,
        email: shooterData[i].email,
        phoneNo: shooterData[i].phoneNo,
        password: shooterData[i].password,
        rollSelect: shooterData[i].rollSelect,
        checked: false,
      });
    }
    const managerData = await userSchema.find({
      rollSelect: 'Manager',
    });
    let data_ = [];
    for (let i = 0; i < managerData.length; i++) {
      data_.push({
        _id: managerData[i]._id,
        firstName: managerData[i].firstName,
        lastName: managerData[i].lastName,
        email: managerData[i].email,
        phoneNo: managerData[i].phoneNo,
      });
    }
    res.status(200).json({
      message: 'recieve Successfully',
      data: clientEvents,
      userData: data,
      managerData: data_,
    });
  } catch (error) {
    res.status(500).json('not added');
  }
};

const managerList = async (req, res) => {
  const managerData = await userSchema.find({
    rollSelect: 'Manager',
  });
  let data_ = [];
  for (let i = 0; i < managerData.length; i++) {
    data_.push({
      firstName: managerData[i].firstName,
      lastName: managerData[i].lastName,
      email: managerData[i].email,
      phoneNo: managerData[i].phoneNo,
    });
  }
  res.status(200).json({
    message: 'recieve Successfully',
    managerData: data_,
  });
};
const postClientListViewController = async (req, res) => {
  // console.log(req,"params")
  const {
    _id,
    locationSelect,
    travelBySelect,
    photoGrapher,
    CinematographerSelect,
    droneSelect,
    sameDaySelect,
    albumSelect,
    albumArray,
    promoSelect,
    longFilmSelect,
    reelsSelect,
    harddriveSelect,
    eventType,
    clientSuggestions,
    dates,
    droneFlyerName,
    photoGrapherName,
    cinematoGrapherName,
    shootDirectorName,
    managerName,
    assistantName,
  } = req.body.data;
  // console.log(req.body.data.event.managerName, 'bodydgfdfdf');
  try {
    const clientEvents = await addClientSchema.findById({
      _id: req.body.data.clientId,
    });
    for (let index = 0; index < clientEvents.events.length; index++) {
      const element = clientEvents.events[index];
      if (element._id == req.body.data.eventId) {
        const data = clientEvents.events.filter((data) => {
          return data._id === req.body.data.eventId;
        });
        const {
          _id,
          locationSelect,
          travelBySelect,
          photoGrapher,
          CinematographerSelect,
          droneSelect,
          sameDaySelect,
          albumSelect,
          albumArray,
          promoSelect,
          longFilmSelect,
          reelsSelect,
          harddriveSelect,
          eventType,
          clientSuggestions,
          dates,
          droneFlyerName,
          photoGrapherName,
          cinematoGrapherName,
          shootDirectorName,
          managerName,
          assistantName,
        } = data[0];
        const dataUpdated = await addClientSchema.findOneAndUpdate(
          {
            _id: req.body.data.clientId,
            'events._id': req.body.data.eventId,
          },
          {
            $set: {
              'events.$.locationSelect': req.body.data.event.locationSelect,
              'events.$.travelBySelect': req.body.data.event.travelBySelect,
              'events.$.photoGrapher': req.body.data.event.photoGrapher,
              'events.$.CinematographerSelect':
                req.body.data.event.CinematographerSelect,
              'events.$.droneSelect': req.body.data.event.droneSelect,
              'events.$.sameDaySelect': req.body.data.event.sameDaySelect,
              'events.$.albumSelect': req.body.data.event.albumSelect,
              'events.$.albumArray': req.body.data.event.albumArray,
              'events.$.promoSelect': req.body.data.event.promoSelect,

              'events.$.longFilmSelect': req.body.data.event.longFilmSelect,
              'events.$.reelsSelect': req.body.data.event.reelsSelect,

              'events.$.harddriveSelect': req.body.data.event.harddriveSelect,
              'events.$.eventType': req.body.data.event.eventType,
              'events.$.clientSuggestions':
                req.body.data.event.clientSuggestions,
              'events.$.dates': req.body.data.event.dates,
              'events.$.droneFlyerName': req.body.data.event.droneFlyerName,
              'events.$.photoGrapherName': req.body.data.event.photoGrapherName,
              'events.$.cinematoGrapherName':
                req.body.data.event.cinematoGrapherName,
              'events.$.shootDirectorName':
                req.body.data.event.shootDirectorName,
              'events.$.managerName': req.body.data.event.managerName,
              'events.$.assistantName': req.body.data.event.assistantName,
            },
          }
        );
        const updatedData = {
          _id: data._id,
          locationSelect: locationSelect,
          travelBySelect: travelBySelect,
          photoGrapher: photoGrapher,
          CinematographerSelect: CinematographerSelect,
          droneSelect: droneSelect,
          sameDaySelect: sameDaySelect,
          albumSelect: albumSelect,
          albumArray: albumArray,
          promoSelect: promoSelect,
          longFilmSelect: longFilmSelect,
          reelsSelect: reelsSelect,
          harddriveSelect: harddriveSelect,
          eventType: eventType,
          clientSuggestions: clientSuggestions,
          dates: dates,
          droneFlyerName: droneFlyerName,
          photoGrapherName: photoGrapherName,
          cinematoGrapherName: cinematoGrapherName,
          shootDirectorName: shootDirectorName,
          managerName: managerName,
          assistantName: assistantName,
        };
        // console.log(updatedData, 'updatedclients');
        //  const updatedClients = await addClientSchema.findById(_id:);
        //  console.log(updatedClients,"updatedClient")
      }
      // const eventData=req.body.events.filter((data)=>{
      //   console.log(data,"data")
      // })
      // console.log(eventData,"eventData")
    }
    // const  clientEventsa=await clientEvents.events.findById({
    //   _id:req.body.data.eventId
    // })
    // console.log(clientEvents, 'clientEventssa');
  } catch (error) {}
  
};

const clientSpecificEvents = async (req, res) => {
  try {
    const data = await addClientSchema.findById({
      _id: req.params.id,
    });
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json(error, 'error');
  }
};
const preWeddingShoot = async (req, res) => {
  try {
    

    const preWed = await PreWeddingShootModel.find({}).populate("ClientId eventId deliverableId userID")

    for (let index = 0; index < preWed.length; index++) { // Sorting 
      preWed[index].eventId.events.sort((a, b) => new Date(b.dates) - new Date(a.dates));
    }

    for (let index = 0; index < preWed.length; index++) { // We only need one event of a client
      let tempEvent = []
      tempEvent.push(preWed[index].eventId.events[0])
      preWed[index].eventId.events = tempEvent
    }

    res.status(200).json(preWed);
  } catch (error) {
    res.status(404).json(error);
  }
};

const preWeddingShootSave = async (req, res) => {
  try {
    

    const preWed = await PreWeddingShootModel.findOneAndUpdate({_id:req.body.data._id},{$set:req.body.data})


    res.status(200).json("preWed");
  } catch (error) {
    res.status(404).json(error);
  }
};

const preWeddingShootupdate = async (req, res) => {

  try {
    const preWeddingData = await addClientSchema.findOne(
      { 'events._id': { $eq: req.body.data._id } }
      // {
      //   locationSelect: req.body.data.locationSelect,
      //   travelBySelect: req.body.data.travelBySelect,
      //   photoGrapher: req.body.data.photoGrapher,
      //   CinematoGrapherSelect: req.body.data.CinematoGrapherSelect,
      //   droneSelect: req.body.data.droneSelect,
      //   sameDaySelect: req.body.data.sameDaySelect,
      //   status:req.body.i,
      //   albumSelect: req.body.data.albumSelect,
      //   albumArray: req.body.data.albumArray,
      //   promoSelect: req.body.data.promoSelect,
      //   longFilmSelect: req.body.data.promoSelect,
      //   reelsSelect: req.body.data.reelsSelect,
      //   eventType: req.body.data.eventType,
      //   checkboxValues: req.body.data.checkboxValues,
      //   clientSuggestions: req.body.data.clientSuggestions,
      //   dates: req.body.data.dates,
      //   sameVideoSelect: req.body.data.sameVideoSelect,
      //   droneFlyerName: req.body.data.droneFlyerName,
      //   photoGrapherName: req.body.data.photoGrapherName,
      //   cinematoGrapherName: req.body.data.cinematoGrapherName,
      //   shootDirectorName: req.body.data.shootDirectorName,
      //   managerName: req.body.data.managerName,
      //   assistantName: req.body.data.assistantName,

      // }
    );
    
//     const mapMethod=preWeddingData[0].events.filter((event)=>{
// const id=event._id===req.params.id
// console.log(id,"id")
//       console.log(event._id===req.params.id)
//       // console.log(id,"iddd")
//     }
//    )
//     console.log(mapMethod,"mapMethod")
    const data = preWeddingData.events.filter((data) => data._id);
    const id = data.filter((id) => id);

    const ids = id.filter((id) => id._id === req.params.id);
   
     ids[0]. locationSelect= req.body.data.locationSelect,
     ids[0]. travelBySelect= req.body.data.travelBySelect,
      ids[0].photoGrapher= req.body.data.photoGrapher,
      ids[0].CinematographerSelect= req.body.data.CinematoGrapherSelect,
      ids[0].droneSelect= req.body.data.droneSelect,
      ids[0].sameDaySelect= req.body.data.sameDaySelect,
      ids[0].status=req.body.i,
      ids[0].albumSelect= req.body.data.albumSelect,
      ids[0].albumArray= req.body.data.albumArray,
      ids[0].promoSelect= req.body.data.promoSelect,
      ids[0].longFilmSelect= req.body.data.promoSelect,
      ids[0].reelsSelect= req.body.data.reelsSelect,
      ids[0].eventType= req.body.data.eventType,
      ids[0].checkboxValues= req.body.data.checkboxValues,
      ids[0].clientSuggestions= req.body.data.clientSuggestions,
      ids[0].dates= req.body.data.dates,
      ids[0].sameVideoSelect= req.body.data.sameVideoSelect,
      ids[0].droneFlyerName= req.body.data.droneFlyerName,
      ids[0].photoGrapherName= req.body.data.photoGrapherName,
      ids[0].cinematoGrapherName= req.body.data.cinematoGrapherName,
      ids[0].shootDirectorName= req.body.data.shootDirectorName,
      ids[0].managerName= req.body.data.managerName,
      ids[0].assistantName= req.body.data.assistantName
      // console.log(ids,"ids")
      const datass=await addClientSchema.findOne({'events._id':{$eq:ids[0]._id}})
    
      // console.log(preWeddingData,"preWeddingData")
    // res.status(200).json(preWeddingData);
    // console.log(preWeddingData,"preWeddingData");
  } catch (error) {
    console.log(error, 'error');
  }
};
module.exports = {
  ClientListViewController,
  postClientListViewController,
  clientSpecificEvents,
  preWeddingShoot,
  preWeddingShootSave,
  managerList,
  preWeddingShootupdate,
};
