const AddClientSchema = require('../models/ClientModel');
const userSchema = require('../models/userSchema');
const ClientModel = require('../models/AddCalenderViewSchema');
const photoGrapherModel = require('../models/DeliverablesPhotographerSchema');
const DeliverableCinematoGrapher = require('../models/DeliverableCinematographerSchema');
const DeliverableAlbumModel = require('../models/DeliverableAlbumSchema');


const getAllCinematographerData = async (req, res) => {

  try {
    const CinematoGrapherData = await DeliverableCinematoGrapher.find({}).populate('userID').populate('eventId').populate('deliverableId').populate("ClientId");
    const editor = await userSchema.find({
      rollSelect: 'Editor',
    });
    res.status(200).json({ data: CinematoGrapherData, editorsList:editor });
  } catch (error) {
    res.status(404).json(error);
  }
};

const getAllPhotgrapherData = async (req, res) => {

  try {
    const CinematoGrapherData = await photoGrapherModel.find({}).populate('userID').populate('eventId').populate('deliverableId').populate("ClientId");
    const editor = await userSchema.find({
      rollSelect: 'Editor',
    });
    res.status(200).json({ data: CinematoGrapherData, editorsList:editor });
  } catch (error) {
    res.status(404).json(error);
  }
};


const getAllAlbumData = async (req, res) => {

  try {
    const CinematoGrapherData = await DeliverableAlbumModel.find({}).populate('userID').populate('eventId').populate('deliverableId').populate("ClientId");
    const editor = await userSchema.find({
      rollSelect: 'Editor',
    });

    res.status(200).json({ data: CinematoGrapherData, editorsList:editor });
  } catch (error) {
    res.status(404).json(error);
  }
};

const DeliverableDataPost = async (req, res) => {
  try {
    const DeliverableId = await DeliverableCinematoGrapher.findOneAndUpdate(
      { _id: req.body.data._id },
      {
        Editor: req.body.data.editorData,
        WeddingDate: req.body.data.deliverableEventDataOptionsSelected,
        companyDate: req.body.data.company,
        Status: req.body.data.statusData,
        ClientRevision: req.body.data.clientRevision,
      }
    );
      res.status(200).json('successfully assigned');

  } catch (error) {
    console.log(error, 'error');
  }
  
};

const PhotosDeliverableData = async (req, res) => {
  try {
    const DeliverableId = await photoGrapherModel.findOneAndUpdate(
      { _id: req.body.data._id },
      {
        Editor: req.body.data.editorData,
        WeddingDate: req.body.data.deliverableEventDataOptionsSelected,
        companyDate: req.body.data.company,
        Status: req.body.data.statusData,
        ClientRevision: req.body.data.clientRevision,
      }
    );
      res.status(200).json('successfully assigned');

  } catch (error) {
    console.log(error, 'error');
  }
};

const AlbumsPostData = async (req, res) => {
  try {
    console.log("AlbumsPostData")
    const DeliverableId = await DeliverableAlbumModel.findOneAndUpdate(
      { _id: req.body.data._id },
      {
        Editor: req.body.data.editorData,
        Status: req.body.data.statusData,
      }
    );
      res.status(200).json('successfully assigned');

  } catch (error) {
    console.log(error, 'error');
  }
};


const getCinematographerData = async (req, res) => {

  try {
    const CinematoGrapherData = await AddClientSchema.find({
      userID: req.params.id,
    });
    const userData = await userSchema.find({ rollSelect: 'Editor' });
    res.status(200).json({ data1: CinematoGrapherData, data2: userData });
  } catch (error) {
    res.status(404).json(error);
  }
};
const getPhotosDataa = async (req, res) => {
  try {
    const CinematoGrapherData = await AddClientSchema.find({
      userID: req.params.id,
    });
    const userData = await userSchema.find({ rollSelect: 'Editor' });
    res.status(200).json({ data1: CinematoGrapherData, data2: userData });
  } catch (error) {
    res.status(404).json(error);
  }
};
const getEditorRule = async (req, res) => {
  try {
    const CinematoGrapherData = await userSchema.find({
      rollSelect: 'Editor',
    });
    res.status(200).json(CinematoGrapherData);
  } catch (error) {
    res.status(404).json(error);
  }
};
const getShooterDetailRule = async (req, res) => {
  try {
    const CinematoGrapherData = await userSchema.findById({
      _id: req.params.id,
    });
    res.status(200).json(CinematoGrapherData);
  } catch (error) {
    res.status(404).json(error);
  }
};
const albumsData = async (req, res) => {
  try {
    const CinematoGrapherData = await AddClientSchema.find({
      userID: req.params.id,
    });

    const userData = await userSchema.find({ rollSelect: 'Editor' });
    res.status(200).json({ data1: CinematoGrapherData, data2: userData });
  } catch (error) {
    res.status(404).json(error);
  }
};

const DeliverableData = async (req, res) => {
  try {
    const cinematoGrapherData = await AddClientSchema.findOne({
      userID: req.params.id,
    });
    const PhotoGrapherData = await photoGrapherModel.findOne({
      userID: req.params.id,
    });
    const albumsData = await DeliverableAlbumModel.findOne({
      userID: req.params.id,
    });
    res.status(200).json({
      cinematoGrapherData: cinematoGrapherData,
      PhotoGrapherData: PhotoGrapherData,
      albumsData: albumsData,
    });
  } catch (error) {
    res.status(404).json(error);
  }
};

const editorCinematoGraphyData = async (req, res) => {
  try {
    const cinematoGrapherData = await DeliverableCinematoGrapher.find({
      EditorId: req.params.id,
    });
    res.status(200).json(cinematoGrapherData);
  } catch (error) {}
};
const EditorPhotosData = async (req, res) => {
  try {
    const PhotosData = await photoGrapherModel.find({
      EditorId: req.params.id,
    });
    res.status(200).json(PhotosData);
  } catch (error) {}
};

const EditorAlbumsData = async (req, res) => {
  try {
    const albumsData = await DeliverableAlbumModel.find({
      EditorId: req.params.id,
    });
    res.status(200).json(albumsData)
  } catch (error) {

    res.status(505).json("NOt INclude")
  }
};

module.exports = {
  getCinematographerData,
  getEditorRule,
  getShooterDetailRule,
  getPhotosDataa,
  albumsData,
  DeliverableDataPost,
  PhotosDeliverableData,
  AlbumsPostData,
  DeliverableData,
  editorCinematoGraphyData,
  EditorPhotosData,
  EditorAlbumsData,
  getAllCinematographerData,
  getAllPhotgrapherData,
  getAllAlbumData,
};
