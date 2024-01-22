// const addClientSchema=require('../Schema/AddClientSchema')

const ListViewSaveController=(req,res)=>{
try {
    // const user=await addClientSchema.findOne({userID:req.params.id})
    res.status(200).json("user")
    
} catch (error) {
    console.log(error)   
}
}



module.exports={ListViewSaveController}