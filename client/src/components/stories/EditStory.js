import React from 'react'
import axios from '../../config/axios'
import StoryForm from './StoryForm'

export default class EditStory extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            isLoaded: false
        }
    }
    render(){
        return(
            <div>
               <h3> Edit Story Component </h3><br/>

                <StoryForm message = "hello"></StoryForm>
            </div>
        )
    }
}