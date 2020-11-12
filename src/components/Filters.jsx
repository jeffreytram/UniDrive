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
    { value: "mimeType = 'application/vnd.google-apps.document'", label: 'Google Docs' },
    { value: "mimeType = 'application/vnd.google-apps.spreadsheet'", label: 'Google Sheets' },
    { value: "mimeType = 'application/vnd.google-apps.presentation'", label: 'Google Slides' },
    { value: "mimeType = 'application/pdf'", label: 'PDF' },
  ];

  const sortCustomStyles = {
    container: (provided) => ({
      ...provided,
      display: 'inline-block',
      width: '180px',
    }),
  };

  const filterCustomStyles = {
    container: (provided) => ({
      ...provided,
      display: 'inline-block',
      width: 'auto',
      minWidth: '150px',
    }),
  };

  const handleFilterChange = (selected) => {
    if (selected) {
      filterFunc(userId, selected.map((option) => option.value));
    } else {
      filterFunc(userId, selected);
    }
  };

  return (
    <div className="filter-container">
      <Select
        defaultValue={sortOptions[0]}
        options={sortOptions}
        onChange={(selected) => sortFunc(userId, selected.value)}
        styles={sortCustomStyles}
      />
      <Select
        closeMenuOnSelect={false}
        isMulti
        options={filterOptions}
        onChange={(selected) => handleFilterChange(selected)}
        placeholder="Filter by..."
        styles={filterCustomStyles}
      />
    </div>
  );
}

Filters.propTypes = {
  filterFunc: PropTypes.func.isRequired,
  sortFunc: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
};
