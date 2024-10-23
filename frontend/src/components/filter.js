import React, { useState, useRef, useEffect } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import ActiveFilter from '../assets/Profile/ActiveFilter.svg';
import Filter from '../assets/Profile/Filter.svg';
import UnactiveFilter from '../assets/Profile/UnactiveFilter.svg';

const FilterComponent = ({ filterHandler }) => {
  // Example data for options and sub-options
  const options = [
    {
      id: 1,
      title: 'Role',
      filters: [
        { title: 'Manager' },
        { title: 'Shooter' },
        { title: 'Editor' },
      ],
    },
    {
      id: 2,
      title: 'Sub Role',
      filters: [
        { title: 'Shoot Director' },
        { title: 'Assistant' },
        { title: 'Photographer' },
        { title: 'Cinematographer' },
        { title: 'Drone Flyers' },
        { title: 'Manager' },
        { title: 'Video Editor' },
        { title: 'Photo Editor' },
        { title: 'Production' },
      ],
    },
    {
      id: 3,
      title: 'Account State',
      filters: [
        { title: 'Ban' },
        { title: 'Unban' },
      ],
    },
  ];

  // States for managing filters
  const [parentFilter, setParentFilter] = useState(null);  // Manages which parent option is expanded
  const [childFilterNauman, setChildFilterNauman] = useState([]);  // Manages selected child filters with parent titles
  const [show, setShow] = useState(false);  // Toggles the entire filter menu visibility
  const filterRef = useRef(null);  // Reference to the filter dropdown

  // Handle clicks outside the filter component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShow(false);  // Close the filter dropdown if clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  // Handle child filter selection, storing both parent and sub-option
  const handleChildFilter = (option, parentTitle) => {
    const alreadySelected = childFilterNauman.some(
      (el) => el.subOption === option.title && el.parentOption === parentTitle
    );
    let updatedFilters;
    
    if (alreadySelected) {
      // Remove if already selected
      updatedFilters = childFilterNauman.filter(
        (el) => !(el.subOption === option.title && el.parentOption === parentTitle)
      );
    } else {
      // Add the selected option
      updatedFilters = [...childFilterNauman, { parentOption: parentTitle, subOption: option.title }];
    }

    setChildFilterNauman(updatedFilters);
    filterHandler(updatedFilters);  // Send the updated state back to parent
  };

  return (
    <div ref={filterRef}>
      {/* Filter Icon that toggles the dropdown visibility */}
      <div
        style={{ marginRight: '20px', cursor: 'pointer' }}
        onClick={() => setShow(!show)}  // Toggle dropdown
      >
        <img alt="Filter" src={Filter} />
      </div>

      {/* Dropdown Menu - only visible when `show` is true */}
      {show && (
        <div
          className="nav_popover"
          style={{
            width: '200px',
            paddingTop: '10px',
            background: '#fff',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            borderRadius: '5px',
            position: 'absolute',
            right: "0",
            marginRight: "30px",
          }}
        >
          {options.map((optionObj, i) => {
            const selected = optionObj.id === parentFilter;  // Check if the parent option is selected

            return (
              <div key={i}>
                {/* Parent Option */}
                <div
                  className="rowalign d-flex flex-row justify-content-between"
                  onClick={() => {
                    if (parentFilter === optionObj.id) {
                      setParentFilter(null);  // Deselect parent
                    } else {
                      setParentFilter(optionObj.id);  // Select parent
                    }
                  }}
                  style={{
                    width: '200px',
                    height: '40px',
                    padding: '10px',
                    cursor: 'pointer',
                    background: selected ? '#666DFF' : '',
                    color: selected ? 'white' : 'black',
                    paddingLeft: '4px',
                  }}
                >
                  <img
                    alt=""
                    src={selected ? ActiveFilter : UnactiveFilter}
                    style={{ width: '20px', height: '20px' }}
                  />
                  <div className="Text16N" style={{ marginLeft: '15px' }}>
                    {optionObj.title}
                  </div>
                  {selected ? (
                    <IoIosArrowUp className="text-white" />
                  ) : (
                    <IoIosArrowDown className="text-black" />
                  )}
                </div>

                {/* Child Options */}
                {selected && (
                  <div style={{ maxHeight: '35vh', overflowY: 'scroll' }}>
                    {optionObj.filters.map((option, j) => {
                      const childSelected = childFilterNauman.some(
                        (el) => el.subOption === option.title && el.parentOption === optionObj.title
                      );

                      return (
                        <div
                          key={j}
                          className="rowalign d-flex align-items-center justify-content-start"
                          onClick={() => handleChildFilter(option, optionObj.title)}
                          style={{
                            marginTop: '10px',
                            width: '200px',
                            paddingLeft: '20px',
                            paddingTop: '5px',
                            cursor: 'pointer',
                            background: childSelected ? '#666DFF' : '',
                            color: childSelected ? 'white' : 'black',
                          }}
                        >
                          <img
                            style={{ width: '20px', height: '23px' }}
                            alt=""
                            src={childSelected ? ActiveFilter : UnactiveFilter}
                          />
                          <div
                            className="Text16N"
                            style={{
                              width: '50%',
                              marginLeft: '15px',
                            }}
                          >
                            {option.title}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FilterComponent;
