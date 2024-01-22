import React from "react";

function CommonInput(props) {
  return (
    <textarea
      placeholder={props.placeholder}
      className={props.style}
    ></textarea>
  );
}

export default CommonInput;
