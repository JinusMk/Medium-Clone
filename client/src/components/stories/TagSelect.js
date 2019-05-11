
import React, { Component } from 'react';

import CreatableSelect from 'react-select/lib/Creatable';
import axios from '../../config/axios';


export default class TagSelect extends Component {
    constructor(props){
        super(props)
        this.state = {
            suggestions: [],
            value : []
        }
    }
  handleChange = (newValue, actionMeta) => {
    console.group('Value Changed', newValue);
    this.setState(()=>({
        value: newValue
    }))
    this.props.handleTagChange(newValue)
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
  }

  componentDidMount(){
         const suggestions = this.props.suggestions.map(tag => ({
             label : tag.name,
             value : tag.name,
             id : tag._id,
             key: tag._id
         }))
         this.setState(() => ({
            suggestions
         }))
                  
       }
  handleCreate = (inputValue) => {
   // console.log('handleCreate called', inputValue)
        const tagData={
            name: inputValue 
        }
            axios.post('/tags',tagData)
            .then(res=>{
              //console.log('responseTagSelect', res.data)
              const tag = {
                label: res.data.name,
                value: res.data.name,
                id: res.data._id,
                key: res.data._id
              }
             // console.log('tagRes',tag)
                this.setState((prevState)=>({ 
                    suggestions: [...prevState.suggestions, tag],
                    value:[...prevState.value, tag]
                }))
            })
            .catch(err=>console.log(err))
  }
  render() {
    console.log('this.state tagselect', this.state)
    return (
      <CreatableSelect
        isMulti
        onChange={this.handleChange}
        options={this.state.suggestions}
        value = {this.state.value}
        placeholder="Add tag.."
        onCreateOption={this.handleCreate}
      />
    );
  }
}