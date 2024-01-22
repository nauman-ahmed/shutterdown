const DummySchema=require("../models/DummySchema")
const dayjs=require("dayjs")
const DummyTableFunction = async (req, res) => {
  const array1=[req.body.data.form2Data[0]]
  const array = [];
  

  const {
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
    tentative,
    eventType,
    radioDeliverables,
    clientSuggestions,
    dates,
    droneFlyerName,
    photoGrapherName,
    cinematoGrapherName,
    shootDirectorName,
    managerName,
    assistantName,
    id,
    sameVideoSelect,
    checkboxValues
  } = req.body.data.form2Data[0];
   
  try {
    const dummyTable = await DummySchema({
      // id,
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
      tentative,
      eventType,
      radioDeliverables,
      clientSuggestions,
      dates:dayjs(dates).format("YYYY-MM-DD"),
      droneFlyerName,
      photoGrapherName,
      cinematoGrapherName,
      shootDirectorName,
      managerName,
      assistantName,
      sameVideoSelect,
      checkboxValues,
      status:""
    });
   
    
    let save=await dummyTable.save()
    if (save) {
      const addDummyData = await DummySchema.find();
      res
        .status(200)
        .json({
          message: 'Client Added SucccessFully',
          data: dummyTable,
          allData: addDummyData,
        });
    }
     
    
   
  } catch (error) {
    console.log(error, 'error');
  }
}
const EditDummyTableFunction = async (req, res) => {
 
 try {
  const {
    locationSelect,
    travelBySelect,
    photoGrapher,
    albumArray,
    dates,
    radioDeliverables,
    CinematographerSelect,
    droneSelect,
    albumSelect,
    promoSelect,
    longFilmSelect,
    reelsSelect,
    harddriveSelect,
    eventType,
    clientSuggestions,
    sameDaySelect,
    status,
    droneFlyerName,
    photoGrapherName,
    cinematoGrapherName,
    shootDirectorName,
    managerName,
    assistantName,
    
  } = req.body.data.updatedData;
  const dummyTable = await DummySchema.findById(
    { _id: req.body.data.id }
  );

// res.status(200).json("successfullyUPdated")
 dummyTable.locationSelect=locationSelect
 dummyTable.travelBySelect = travelBySelect;
 dummyTable.photoGrapher = photoGrapher;
 dummyTable.CinematographerSelect = CinematographerSelect;
 dummyTable.droneSelect = droneSelect;
 dummyTable.albumSelect = albumSelect;
 dummyTable.promoSelect = promoSelect;
  dummyTable.longFilmSelect = longFilmSelect;
dummyTable.reelsSelect = reelsSelect;
dummyTable.harddriveSelect = harddriveSelect;
dummyTable.eventType = eventType;
dummyTable.clientSuggestions = clientSuggestions;
 dummyTable.photoGrapherName = photoGrapherName
 dummyTable.droneFlyerName = droneFlyerName
 dummyTable.cinematoGrapherName = cinematoGrapherName
 dummyTable.shootDirectorName = shootDirectorName
 dummyTable.managerName = managerName
 dummyTable.assistantName = assistantName
 const updatedData=await DummySchema.findByIdAndUpdate({_id:dummyTable._id},dummyTable)
 if (updatedData) {
  
   res.status(200).json('YOur Data has been updated');
 }
 } catch (error) {
  res.status(500).json(error)
 }
};
const EditDummyDataTableId=async(req,res)=>{

}
  module.exports = {
    DummyTableFunction,
    EditDummyTableFunction,
    EditDummyDataTableId,
  };