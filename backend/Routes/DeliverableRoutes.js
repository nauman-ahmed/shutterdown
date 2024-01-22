const express = require('express');
const router = express.Router();
const delivarableController = require('../Controllers/DeliverableController');

router.get(
  '/MyProfile/Deliverables/Cinematography',
  delivarableController.getAllCinematographerData
);
router.get(
  '/MyProfile/Deliverables/Photos',
  delivarableController.getAllPhotgrapherData
);

router.get(
  '/MyProfile/Deliverables/Albums',
  delivarableController.getAllAlbumData
);

router.post(
  '/MyProfile/Deliverables/Cinematography',
  delivarableController.DeliverableDataPost
);

router.post(
  '/MyProfile/Deliverables/Photos',
  delivarableController.PhotosDeliverableData
);

router.post(
  '/MyProfile/Deliverables/Albums',
  delivarableController.AlbumsPostData
);


router.get(
  '/MyProfile/Deliverables/Cinematography/:id',
  delivarableController.getCinematographerData
);
// router.get(
//   '/MyProfile/Deliverables/Cinematography',
//   delivarableController.getEditorRule
// );
router.get(
  '/MyProfile/Deliverables/Albums/:id',
  delivarableController.albumsData
);

router.post(
  '/MyProfile/Deliverables/Photos',
  delivarableController.PhotosDeliverableData
);

router.get(
  '/MyProfile/Client/ParticularClient/Deliverable/:id',
  delivarableController.DeliverableData
);
router.get('/Deliverables/Cinematography/:id',delivarableController.editorCinematoGraphyData)
router.get('/Deliverables/Photos/:id',delivarableController.EditorPhotosData)
router.get('/Deliverables/Albums/:id',delivarableController.EditorAlbumsData)
module.exports = router;
