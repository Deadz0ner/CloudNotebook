const express = require('express')
const router = express.Router();
const Notes=require('../models/Notes')
var fetchuser=require('../middleware/getuser')
const {body, validationResult} = require('express-validator');

//ROUTE1: Get all the notes using GET "/api/notes/fetchallnotes".Login Required
router.get('/fetchallnotes', fetchuser, async (req,res)=>{  //this is request and reponse
    try {
        const notes=await Notes.find({user:req.user.id})
        res.json(notes)
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Some kinda1 error occured')
    }  

})
//ROUTE2:Add a new Note using POST "/api/notes/addnote".Login Required
router.post('/addnote',[
    body('title','Enter a valid title').isLength({min:3}),
    body('description', 'Description must be atleast 4 characters').isLength({min:4}),
], fetchuser, async (req,res)=>{
    const errors=validationResult(req)
    try {
        const {title, description}=req.body;
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        const note = new Notes({
            title,description,user:req.user.id
        })
        const savedNote= await note.save()
        res.json(savedNote)
    }catch (error) {
        console.error(error.message);
        res.status(500).send('Some kinda2 error occured')
    }
})

//ROUTE3:Update an existing Note using PUT "/api/notes//updatenote/:id".Login Required
router.put('/updatenote/:id', fetchuser, async (req,res)=>{
const {title,description}=req.body;
//new node
const newnote = {}
if(title){
    newnote.title=title
}
if(description){newnote.description=description}

//Find the note to be updated
let note=await Notes.findById(req.params.id);
if(!note){res.status(404).send('Not Found')}

if(note.user.toString()!==req.user.id){
    return res.status(401).send("not Allowed")
}
note=await Notes.findByIdAndUpdate(req.params.id,{$set:newnote},{new:true})
res.json({note});
})


//ROUTE4: Delete an existing Note using DELETE "/api/notes/delete/:id".Login Required
router.delete('/delete/:id', fetchuser, async (req,res)=>{
    
    try {//Find the note to be deleted 
        let note=await Notes.findById(req.params.id);
        if(!note){res.status(404).send('Not Found')}
        
        //allow deletion only if user owns this note
        if(note.user.toString()!==req.user.id){
            return res.status(401).send("not Allowed")
        }
        note=await Notes.findByIdAndDelete(req.params.id)
        res.json({"success":"note has been deleted",note:note});
        }
        
        catch (error) {
            console.error(error.message);
            res.status(500).send('Internal Server Error')
        }

})
    
    

module.exports = router
