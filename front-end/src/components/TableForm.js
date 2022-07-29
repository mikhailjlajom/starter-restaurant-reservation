import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";

// the table form component
function TableForm() {
  const history = useHistory();

  // initial state of table form
  let initialState = {
    table_name: "",
    capacity: "",
  };

  // useState variable and function for creating new table

  const [newTable, setNewTable] = useState(initialState);

  // cancel click handler, when clicked goes back to previous page

  const cancelClick = () => {
    history.goBack();
  };

  // change hanlder function
  // change value of table capacity to a number

  function changeHandler(evt) {
    const resKey = evt.target.name;
    let resValue = evt.target.value;
    if (resKey === "capacity" && resValue) {
      resValue = parseInt(resValue);
    }
    setNewTable({ ...newTable, [resKey]: resValue });
  }

  // submit handler

  async function submitHandler(evt) {
    evt.preventDefault();
    try {
      const abortController = new AbortController();
      await createTable({ data: newTable }, abortController.signal);
      history.push(`/dashboard`);
    } catch (error) {
      console.log(error);
    }
  }

  // the format of table form
  // styling done with bootstrap
  // form needs to input fields and 2 buttons

  return (
    <>
      <h1>Create Table</h1>
      <div></div>
      <form onSubmit={submitHandler}>
        <fieldset>
          <div className="row">
            <div className="form-group col">
              <label>Table Name</label>
              <br></br>
              <input
                type="text"
                id="table_name"
                name="table_name"
                required={true}
                placeholder="Table Name"
                onChange={changeHandler}
                value={newTable.table_name}
                className="form-control"
              />
            </div>
            <div className="form-group col">
              <label>Capacity</label>
              <br></br>
              <input
                type="number"
                id="capacity"
                name="capacity"
                required={true}
                onChange={changeHandler}
                value={newTable.capacity}
                className="form-control"
              />
            </div>
          </div>
          <button
            type="button"
            className="btn btn-secondary mr-2"
            onClick={cancelClick}
          >
            <span className="oi oi-x"></span>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
          <span className="oi oi-check"></span>
            Submit
          </button>
        </fieldset>
      </form>
    </>
  );
}

// export TableForm for Routes file
export default TableForm;
