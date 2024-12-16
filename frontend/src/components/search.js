import React, { useState } from 'react';
import { Input, FormGroup } from 'reactstrap';

const SearchComponent = ({ handleSearchChange, searchTerm }) => {


  return (
    <div className='mx-3'>
      <FormGroup>
        <Input
          type="text"
          placeholder="Search name..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </FormGroup>
    </div>
  );
};

export default SearchComponent;
