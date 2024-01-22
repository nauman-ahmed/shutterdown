const AddClientSchema = require('../models/ClientModel');
const CheckListSchema = require('../models/CheckListSchema');

const CheckListData = async (req, res) => {
  try {
    const ClientListData = await AddClientSchema.find({});
    const ChecklistData = await CheckListSchema.find({});

    res.status(200).json({ClientListData,ChecklistData});
  } catch (error) {}
};

const CheckListDataPost = async (req, res) => {
  try {

    const CheckListData = await CheckListSchema.find({ id: req.body.id });

    if (CheckListData.length === 0) {
      const CheckListDatas = await CheckListSchema({
        id: req.body.id,
        client: {
          BrideName: req.body.data.BrideName,
          GroomName: req.body.data.GroomName,
        },
        WhatsAppAccount: req.body.data.WhatsAppGroup,
        LightSopSentDate: req.body.data.WhatsAppDate,
        QuesnrSentDate: req.body.data.QuesnrDate,
        iternaryCollection: req.body.data.collection,
      });
      // console.log(CheckListData, 'CheckListData');
      await CheckListDatas.save();
      res.status(200).json('it is saved');

    } else {

      const findIddata = await CheckListSchema.findOneAndUpdate(
        { id: req.body.id },
        {
          id: req.body.id,
          Client: {
            BrideName: req.body.data.BrideName,
            GroomName: req.body.data.GroomName,
          },
          WhatsAppAccount: req.body.data.WhatsAppGroup,
          LightSopSentDate: req.body.data.WhatsAppDate,
          QuesnrSentDate: req.body.data.QuesnrDate,
          iternaryCollection: req.body.data.collection,
        }
      );
      res.status(200).json("it is Updated")

    }
    // await CheckListData.save();
  } catch (error) {
    console.log(error, 'error');
  }
};
module.exports = { CheckListData, CheckListDataPost };
