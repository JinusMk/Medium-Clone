import React from 'react'
import axios from '../../config/axios'
import Topic from './TopicShow'
import StoryForm from './StoryForm'

class CreateStory extends React.Component{
    constructor(props){
        super(props)
    }
    handleSubmit = (formData) =>{
        // console.log('create story body ->', formData.get('body'))
        console.log('flag - create story ->')
            axios.post('/stories/new', {formData})
            .then(response => {
                const story = response.data
                console.log('saved story', story)
                this.props.history.push('/me/stories/drafts')
            })
            .catch(err => {
                console.log('error create story', err)
            })
       
    }
   
   
    render(){
        
        return(
            <div>
                <h2>Create A New Article</h2>
                
                <StoryForm handleSubmit = {this.handleSubmit}></StoryForm>
            </div>
        )
    }
}
export default CreateStory