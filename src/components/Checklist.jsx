import React, { Component } from 'react'
import './Checklist.css'
import  CheckBox  from './CheckBox'


class Checklist extends Component {
  constructor() {
    super()
    this.state = {
      fruites: [
        {id: 1, value: "Google Docs", isChecked: false},
        {id: 2, value: "Google Sheets", isChecked: false},
        {id: 3, value: "Google Slides", isChecked: false},
        {id: 4, value: "PDF", isChecked: false}
      ],
      displayed: 'none'
      
    }
  }

  viewToggle = () => {
    this.setState((prevState) => {
      let display = prevState.displayed
      return {
      displayed: (display === 'none') ? 'block' : 'none'
      }
    })
  }

  handleAllChecked = (event) => {
    let fruites = this.state.fruites
    fruites.forEach(fruite => fruite.isChecked = false) 
    this.setState({fruites: fruites} , () => {this.applyFilter()})
  }

  handleCheckChieldElement = (event) => {
    let fruites = this.state.fruites
    fruites.forEach(fruite => {
       if (fruite.value === event.target.value)
          fruite.isChecked =  event.target.checked
    })
    this.setState({fruites: fruites}, () => {this.applyFilter()})
  }


applyFilter = () => {
  const { userId } = this.props;
  const { filterFunc } = this.props;
  let filterBy = "";
  let fruites = this.state.fruites
  let firstChecked = -1;
  let count = 0;
    fruites.forEach(fruite => {
      if (fruite.isChecked) {
        filterBy = filterBy + " " + fruite.value;
        if (firstChecked === -1) {

          firstChecked = count;
        }
      }
      count ++;
    })
    filterFunc(userId, filterBy, firstChecked)
}



  render() {
    const {
      filterFunc, userId
    } = this.props;
    return (
      <div className="Checklist" >
        <button
        
          type="button"
          className="ChecklistButton"
          onClick={() => this.viewToggle()}
          onKeyDown={() => this.viewToggle()}
        > Toggle Filter </button>
      <div style={{display: this.state.displayed}} className="ChecklistItems">
      <button type="button" onClick={() => this.handleAllChecked()}> Clear Filter </button>
        <ul>
        {
          this.state.fruites.map((fruite, index) => {
            return (<CheckBox key={index} handleCheckChieldElement={this.handleCheckChieldElement}  {...fruite} />)
          })
        }
        </ul>
        </div>
      </div>
    );
  }
}

export default Checklist