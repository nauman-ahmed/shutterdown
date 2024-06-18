import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "react-calendar/dist/Calendar.css";
import "../../assets/css/common.css";
import "../../assets/css/Profile.css";
import "../../assets/css/tooltip.css";
import "react-toastify/dist/ReactToastify.css";
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { stateToHTML } from 'draft-js-export-html';
import { Button } from "reactstrap";
import { postWhatsappText, getAllWhatsappText } from "../../API/Whatsapp"
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function Whatsapp() {
 
  const [currentTask, setCurrentTask] = useState(1);
  const [editorState, setEditorState] = useState({
    albumTextGetImmutable:EditorState.createEmpty(),
    cinematographyTextGetImmutable:EditorState.createEmpty(),
    _id: null
  });

  const loadEditorContent = (rawContent) => {
    const contentState = convertFromRaw(JSON.parse(rawContent));
   return EditorState.createWithContent(contentState);
    // Use `newEditorState` in your editor component
  };

  const getAllWhatsappTextHandler = async () => {
    const res = await getAllWhatsappText()
    const newEditorStateAlbum = loadEditorContent(res.data[0].albumTextGetImmutable)
    const newEditorStatecinematography = loadEditorContent(res.data[0].cinematographyTextGetImmutable)
    console.log("getAllWhatsappTextHandler",newEditorStateAlbum, newEditorStatecinematography)

    setEditorState({
      _id: res.data[0]._id,
      albumTextGetImmutable: newEditorStateAlbum,
      cinematographyTextGetImmutable: newEditorStatecinematography,
    })
  }

  useEffect(() => {
    getAllWhatsappTextHandler()
  },[])

  const onEditorStateChangeHandler = (e) => {
    if(currentTask == 1){
      setEditorState((prevState) => ({
        ...prevState,
        albumTextGetImmutable:e,
        album: convertToRaw(e.getCurrentContent())
      }))
    }else{
      setEditorState((prevState) => ({
        ...prevState,
        cinematographyTextGetImmutable:e,
        cinematography: convertToRaw(e.getCurrentContent())
      }))
    }
  }

  const saveEditorContent = (editorStatealbumTextGetImmutable) => {
    const contentState = editorStatealbumTextGetImmutable.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    return JSON.stringify(rawContentState);
  };

  const updateHandler = async () => {
    const stringifiedContentAlbum = saveEditorContent(editorState.albumTextGetImmutable)
    const stringifiedContentCinematography = saveEditorContent(editorState.cinematographyTextGetImmutable)
    console.log("updateHandler",typeof stringifiedContentAlbum)
    console.log("updateHandler",stringifiedContentCinematography)
    const res = await postWhatsappText({
      _id: editorState._id,
      albumTextGetImmutable:stringifiedContentAlbum,
      cinematographyTextGetImmutable: stringifiedContentCinematography
    })
    if(res.status == 200) {
      toast.success(res.data.message);
      return
    }
    toast.error("Something went wrong");
  }

  return (
    <>
      <ToastContainer />
      <div className="mt18">
        <div className="d-flex justify-content-around p-3" >
          <div className="p-1"  style={currentTask == 1 ? {  borderBottom: "solid", cursor: "pointer" } : {  borderBottom: "solid", color: "lightgray", cursor: "pointer" }}
            onClick={() => setCurrentTask(1)}
          >
            Text 1
          </div>
          <div  className="p-1"  style={currentTask == 2 ? {  borderBottom: "solid", cursor: "pointer" } : {  borderBottom: "solid", color: "lightgray", cursor: "pointer" }}
            onClick={() => setCurrentTask(2)}
          >
            Text 2
          </div>
        </div>
        <Editor
          editorState={currentTask == 1 ? editorState.albumTextGetImmutable : editorState.cinematographyTextGetImmutable}
          wrapperClassName="wrapperClassName"
          onEditorStateChange={onEditorStateChangeHandler}
        />
        <div className="d-flex my-5 justify-content-around p-3" >
          <Button
            type='submit' color="danger"
            onClick={() => updateHandler()}
          >
            Update
          </Button>
        </div>
      </div>
    </>
  );
}

export default Whatsapp;
