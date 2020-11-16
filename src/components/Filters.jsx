import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import '../css/Filters.css';

export default function Filters({ filterFunc, sortFunc, userId }) {
  const sortOptions = [
    { value: 'folder, createdTime desc', label: 'Newest' },
    { value: 'folder, createdTime', label: 'Oldest' },
    { value: 'folder, name', label: 'By Name' },
    { value: 'folder, viewedByMeTime desc', label: 'Last Opened by Me' },
    { value: 'folder, modifiedTime desc', label: 'Last Modified' },
  ];

  const filterOptions = [
    { value: "mimeType = 'application/vnd.google-apps.folder' or mimeType = 'application/vnd.google-apps.document'", label: 'Google Docs' },
    { value: "mimeType = 'application/vnd.google-apps.folder' or mimeType = 'application/vnd.google-apps.spreadsheet'", label: 'Google Sheets' },
    { value: "mimeType = 'application/vnd.google-apps.folder' or mimeType = 'application/vnd.google-apps.presentation'", label: 'Google Slides' },
    { value: "mimeType = 'application/vnd.google-apps.folder' or mimeType = 'application/pdf'", label: 'PDF' },
    { value: "mimeType = 'application/vnd.google-apps.folder' or mimeType contains 'image/' ", label: 'Images' },
    { value: "mimeType = 'application/vnd.google-apps.folder' or mimeType contains 'video/'", label: 'Videos' },
    { value: "mimeType = 'application/vnd.google-apps.folder' or mimeType contains 'text/'", label: 'Text' },
    { value: "mimeType = 'application/vnd.google-apps.folder' or not mimeType contains 'text/'" +
     " and not mimeType contains 'video/' and not mimeType contains 'image/' and not mimeType = 'application/pdf'" +
     " and not mimeType = 'application/vnd.google-apps.presentation' and not mimeType = 'application/vnd.google-apps.spreadsheet' and not mimeType = 'application/vnd.google-apps.document'", label: 'Misc' }

  ];

  const customStyles = (container) => ({
    container,
    control: (provided) => ({
      ...provided,
      borderRadius: '5px',
      minHeight: '1px',
      height: '32px',
      backgroundColor: 'var(--sub-bg)',
    }),
    input: (provided) => ({
      ...provided,
      minHeight: '1px',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      minHeight: '1px',
      paddingTop: '0',
      paddingBottom: '0',
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      minHeight: '1px',
      height: '16px',
    }),
    clearIndicator: (provided) => ({
      ...provided,
      minHeight: '1px',
    }),
    valueContainer: (provided) => ({
      ...provided,
      minHeight: '1px',
      height: '32px',
      paddingTop: '0',
      paddingBottom: '0',
      marginBottom: '4px',
    }),
    singleValue: (provided) => ({
      ...provided,
      minHeight: '1px',
      paddingBottom: '2px',
      color: 'var(--text)',
    }),
    placeholder: (provided) => ({
      ...provided,
      minHeight: '1px',
      paddingBottom: '2px',
    }),
    menu: (provided) => ({
      ...provided,
      background: 'var(--sub-bg)',
    }),
    option: (provided, { isFocused, isSelected }) => ({
      ...provided,
      color: isSelected ? 'white' : isFocused ? '#303030' : 'var(--text)',
      cursor: isFocused ? 'pointer' : 'default',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#303030',
    }),
  });

  const sortContainer = (provided) => ({
    ...provided,
    display: 'inline-block',
    width: '180px',
  });

  const filterContainer = (provided) => ({
    ...provided,
    display: 'inline-block',
    width: 'auto',
    minWidth: '150px',
    zIndex: "4"
    
  });

  const handleFilterChange = (selected) => {
    if (selected) {
      filterFunc(userId, selected.map((option) => option.value));
    } else {
      filterFunc(userId, selected);
    }
  };

  return (
    <div className="filter-container">
      Sort by: &nbsp;
      <Select
        defaultValue={sortOptions[0]}
        isSearchable={false}
        options={sortOptions}
        onChange={(selected) => sortFunc(userId, selected.value)}
        styles={customStyles(sortContainer)}
      />
      &nbsp; &nbsp; &nbsp;
      Filter by: &nbsp;
      <Select
        closeMenuOnSelect={false}
        isMulti
        options={filterOptions}
        onChange={(selected) => handleFilterChange(selected)}
        placeholder="File type..."
        styles={customStyles(filterContainer)}
      />
    </div>
  );
}

Filters.propTypes = {
  filterFunc: PropTypes.func.isRequired,
  sortFunc: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
};
