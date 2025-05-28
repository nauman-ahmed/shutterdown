const deadlineDaysModel = require("../models/DeadlineDays");
const deliverableModel = require("../models/DeliverableModel");
const DeliverableModel = require("../models/DeliverableModel");
const DeliverableOptionsSchema = require("../models/DeliverableOptionsSchema");
const User = require("../models/userSchema")
const dayjs = require("dayjs");
const monthNumbers = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

const getCinematography = async (req, res) => {
  try {



    const { startDate, endDate } = req.query;
    // Fetch Cinematography deliverables
    const cinematographyDeliverables = await DeliverableModel.find({
      deliverableName: { $in: ["Long Film", "Reel", "Promo", "Performance Film"] },
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate([
      {
        path: "client",
        populate: {
          path: "events",
          model: "Event",
        },
      },
      { path: "editor", model: "user" },
    ]);


    res.status(200).json({ data: cinematographyDeliverables });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

const getAlbums = async (req, res) => {
  try {
    // Fetch album values from the schema
    const allDocument = await DeliverableOptionsSchema.find({}, { albums: 1 });
    let albumValues = [];

    // Extract album values
    for (let index = 0; index < allDocument[0].albums.values.length; index++) {
      albumValues.push(allDocument[0].albums.values[index]["value"]);
    }



    const { startDate, endDate } = req.query;


    const albumsDeliverables = await DeliverableModel.find({
      deliverableName: { $in: albumValues },
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate([
      {
        path: "client",
        populate: {
          path: "events",
          model: "Event",
        },
      },
      { path: "editor", model: "user" },
    ]);


    res.status(200).json({ data: albumsDeliverables });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

const getPhotos = async (req, res) => {
  try {

    const { startDate, endDate } = req.query;


    // Fetch photos deliverables
    const photosDeliverables = await DeliverableModel.find({
      deliverableName: "Photos",
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate([
      {
        path: "client",
        populate: {
          path: "events",
          model: "Event",
        },
      },
      { path: "editor", model: "user" },
    ]);


    res.status(200).json({ data: photosDeliverables });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

const getPreWeds = async (req, res) => {
  try {

    const { startDate, endDate } = req.query;


    // Fetch Pre-Wedding deliverables
    const preWedDeliverables = await DeliverableModel.find({
      deliverableName: { $in: ["Pre-Wedding Photos", "Pre-Wedding Videos"] },
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate([
      {
        path: "client",
        populate: {
          path: "events",
          model: "Event",
        },
      },
      { path: "editor", model: "user" },
    ]);

    res.status(200).json({ data: preWedDeliverables });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

const updateDeliverable = async (req, res) => {
  try {
    await DeliverableModel.findByIdAndUpdate(req.body.deliverable._id, {
      ...req.body.deliverable,
      client: req.body.deliverable.client._id,
      editor: req.body.deliverable.editor?._id,
    }).then(() => {
      res.status(200).json("Deliverable Updated Successfully!");
    });
  } catch (error) {
    console.log(error);
  }
};

const addDateinDeliverales = async () => {
  const allDeliverables = await deliverableModel.find().populate([
    {
      path: "client",
      populate: {
        path: "events",
        model: "Event",
      },
    },
  ]);
  allDeliverables.forEach(async (deliverable) => {
    let dateforDeliverable = null;
    deliverable.client.events.forEach(async (event) => {
      if (event.isWedding) {
        dateforDeliverable = dayjs(event.eventDate).format("YYYY-MM-DD");
      }
    });
    if (dateforDeliverable == null) {
      dateforDeliverable = dayjs(
        deliverable.client.events[deliverable.client.events.length - 1]
          .eventDate
      ).format("YYYY-MM-DD");
    }
    deliverable.date = dateforDeliverable;
    await deliverableModel.findByIdAndUpdate(deliverable._id, deliverable);
  });
  console.log("added dates in deliverales");
};

// Helper function to get editor with populated deliverables
const getEditorWithDeliverables = async (editorId) => {
  // Fetch the single DeadlineDays document
  const deadlineDays = await deadlineDaysModel.findOne().lean();
  if (!deadlineDays) {
    throw new Error('Deadline days configuration not found');
  }

  const deliverables = await DeliverableModel.find({ editor: editorId })
    .populate('client', 'firstName lastName email brideName groomName') // Populate client data with specific fields
    .lean();

  // Helper function to get relevant deadline days based on deliverableName
  const getRelevantDeadline = (deliverableName) => {
    const name = deliverableName.toLowerCase();
    if (name.includes('long film')) return deadlineDays.longFilm;
    if (name.includes('reel')) return deadlineDays.reel;
    if (name.includes('promo')) return deadlineDays.promo;
    if (name.includes('photo') && name.includes('pre-wed')) return deadlineDays.preWedPhoto;
    if (name.includes('video') && name.includes('pre-wed')) return deadlineDays.preWedVideo;
    if (name.includes('album')) return deadlineDays.album;
    if (name.includes('performance film')) return deadlineDays.performanceFilms;
    return deadlineDays.photo; // Default to photo if no match
  };

  // Get current date (start of day for comparison)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Group deliverables by status and check for overdue
  const yetToStartDelivs = [];
  const inProgressDelivs = [];
  const completedDelivs = [];
  const overdueDelivs = [];

  deliverables.forEach(del => {
    const status = del.status;
    // Calculate deadline date
    const deliverableDate = new Date(del.date);
    const deadlineDaysCount = getRelevantDeadline(del.deliverableName);
    const deadlineDate = new Date(deliverableDate);
    deadlineDate.setDate(deliverableDate.getDate() + deadlineDaysCount);
    del.deadlineDate = deadlineDate;

    // Check if deliverable is overdue (past deadline and in 'Yet to Start' or 'In Progress')
    const isOverdue = deadlineDate < today && (status === 'Yet to Start' || status === 'In Progress');

    // Group deliverables
    if (status === 'Yet to Start') {
      yetToStartDelivs.push(del);
      if (isOverdue) overdueDelivs.push(del);
    } else if (status === 'In Progress') {
      inProgressDelivs.push(del);
      if (isOverdue) overdueDelivs.push(del);
    } else if (['Completed', 'Closed', 'Delivered'].includes(status)) {
      completedDelivs.push(del);
    }
  });

  return {
    yetToStartDelivs,
    inProgressDelivs,
    completedDelivs,
    overdueDelivs
  };
};

// Controller function to get editors with their deliverables
const getEditorsWithDeliverables = async (req, res) => {
  try {
    const { page = 1, editorId } = req.query;
    const limit = 12;
    const skip = (page - 1) * limit;

    let editors = [];
    let totalEditors = 0;
    let totalPages = 0;

    if (editorId) {
      // Fetch single editor by editorId
      const editor = await User.findOne({
        _id: editorId,
        rollSelect: 'Editor'
      })
        .select('firstName lastName middleName phoneNo email dateOfJoining')
        .sort({ firstName: 1 }) // Sort by firstName for consistency
        .lean();

      if (!editor) {
        return res.status(404).json({
          success: false,
          message: 'Editor not found or not an editor'
        });
      }

      editors = [editor];
      totalEditors = 1;
      totalPages = 1;
    } else {
      // Fetch editors with pagination
      editors = await User.find({ rollSelect: 'Editor' })
        .select('firstName lastName middleName phoneNo email dateOfJoining')
        .sort({ firstName: 1 }) // Sort by firstName in ascending order
        .skip(skip)
        .limit(limit)
        .lean();

      totalEditors = await User.countDocuments({ rollSelect: 'Editor' });
      totalPages = Math.ceil(totalEditors / limit);
    }

    // Map editors with their deliverables
    const editorsWithDeliverables = await Promise.all(
      editors.map(async (editor) => {
        const deliverables = await getEditorWithDeliverables(editor._id);
        return {
          editor: {
            id: editor._id,
            firstName: editor.firstName,
            lastName: editor.lastName,
            middleName: editor.middleName,
            phoneNo: editor.phoneNo,
            email: editor.email,
            dateOfJoining: editor.dateOfJoining
          },
          deliverables: {
            yetToStartDelivs: deliverables.yetToStartDelivs,
            inProgressDelivs: deliverables.inProgressDelivs,
            completedDelivs: deliverables.completedDelivs,
            overdueDelivs: deliverables.overdueDelivs
          }
        };
      })
    );

    // Send response
    res.status(200).json({
      success: true,
      data: editorsWithDeliverables,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalEditors
      }
    });
  } catch (error) {
    console.error('Error fetching editors with deliverables:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching editors and deliverables',
      error: error.message
    });
  }
};

// Controller function to get all editors with basic details
const getAllEditors = async (req, res) => {
  try {


    const editors = await User.find({ rollSelect: 'Editor' })
      .select('firstName lastName middleName phoneNo email dateOfJoining')
      .sort({ firstName: 1 }) // Sort by firstName in ascending order
      .lean();



    // Send response
    res.status(200).json({
      success: true,
      data: editors.map(editor => ({
        _id: editor._id,
        firstName: editor.firstName,
        lastName: editor.lastName,
        middleName: editor.middleName,
        phoneNo: editor.phoneNo,
        email: editor.email,
        dateOfJoining: editor.dateOfJoining
      })),
     
    });
  } catch (error) {
    console.error('Error fetching editors:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching editors',
      error: error.message
    });
  }
};



module.exports = {
  getCinematography,
  getAlbums,
  getPhotos,
  getPreWeds,
  getAllEditors,
  updateDeliverable,
  addDateinDeliverales,
  getEditorsWithDeliverables
};
