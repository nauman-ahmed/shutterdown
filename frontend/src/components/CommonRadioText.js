import React, { useState } from "react";



function CommonRadioText(props) {
  const {
    setCheckboxValues,
    checkboxValues,
    array,
    disabled
  } = props;
  const handleOnChange = (e) => {
    const { value } = e.target;
    if (checkboxValues.includes(value)) {
      setCheckboxValues(checkboxValues.filter(item => item !== value));
    } else {
      setCheckboxValues([...checkboxValues, value]);
    }
  }

  return (
    <div className={props.divstyle}>
      <div className="Text16N" style={{ marginBottom: "6px" }}>
        {props.name}
      </div>
      <div className="Text16N">
        <input type="checkbox"
          value="Pre_Wedding_Photos"
          onChange={handleOnChange}
          name="Pre_Wedding_Photos" 
          checked={array ? array.includes("Pre_Wedding_Photos") ? true : false : null}
          disabled={disabled?true:false}
          />
        {"   "}
          Pre Wedding Photos
        <input
          onChange={handleOnChange}
          type="checkbox"
          value="Pre_Wedding_Videos"
          name="Pre_Wedding_Videos"
          style={{ marginLeft: "20px" }}
          checked={array ? array.includes("Pre_Wedding_Videos") ? true : false : null}
          disabled={disabled?true:false}
        />
        {"   "}
        Pre Wedding Videos
        <input
          onChange={handleOnChange}
          type="checkbox"
          value="Photos"
          name="Photos"
          style={{ marginLeft: "20px" }}
          checked={array ? array.includes("Photos") ? true : false : null}
          disabled={disabled?true:false}
        />
        {"   "}
        Photos
      </div>
    </div>
  );
}

export default CommonRadioText;

