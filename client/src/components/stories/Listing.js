import React from 'react'
import axios from '../../config/axios'
import {Link} from 'react-router-dom'
import StoryForm from './CreateStory';
import StoryItem from './ListItem'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser'

class ListStory extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            stories: [],
            limit: 5
        }
    }
    componentDidMount(){
        axios.get('/stories/public')
            .then(response => {
               // console.log('List story', response.data)
                const stories = response.data
                stories.map(story => {
                    const html = story.body
                    return <div>{ story.body = ReactHtmlParser(html) }</div>;
                })
                console.log('List stories', stories)
                this.setState(()=>({
                    stories
                }))
            })
            .catch(err => {
                console.log(err)
            })
    }
    handleClick = () => {
        this.setState((prevState)=>({
            limit: prevState.limit + 5
        }))
    }
    render(){
        return(
            <div>
                {this.state.stories.length == 0 ? (<p>No Stories found, Add your first story! </p>):(
                    <div>
                        <h2>Listing Story - {this.state.stories.length}</h2>
                        <div className = "container">
            <div className = "row">
                <div className = "col-md-12">
                <h4 className="small-heading border-top">Stories</h4>
                {
                    this.state.stories.slice(0,this.state.limit).map(story => {
                        return(
                           <StoryItem title = {story.title} body = {story.body} id = {story._id} key = {story._id} author = {story.author.username} image = {story.previewImage} claps = {story.claps}/>
                        )
                      
                    })
                }
                <button className = "btn btn-block btn-outline-secondary" onClick = {this.handleClick}> Read More</button>
                <p> Showing {this.state.limit} Of {this.state.stories.length} Posts </p>
                </div>

            </div>

            </div>
                    </div>
                )}
            <Link to = "stories/add-new-story">Add New Story</Link>
            </div>
        )
    }
}

export default ListStory