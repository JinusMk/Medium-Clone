import React from 'react'
import axios from '../../config/axios'
import StoryItem from '../stories/ListItem'

export default class Bookmarks extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            bookmarksId: [],
            isLoaded : false,
            bookmarks: []
        }
    }
    componentDidMount(){
        axios.get('/stories/bookmarks')
            .then(res =>{
                console.log(res.data)
                const bookmarks = res.data.bookmarks
                let bookmarksId = []
                if(bookmarks.length > 0){
                    bookmarks.map(story => {
                        bookmarksId.push(story._id)
                        axios.get(`/users/${story.author}`)
                        .then(res => {
                            console.log('/author Details', res.data)
                            story.author = res.data
                            this.setState(()=>({
                                bookmarks,
                                isLoaded: true,
                                bookmarksId
                            }))
                        })
                        .catch(err => {
                            console.log('/users/:id', err)
                        })
                    })
                }
            })
            .catch(err =>{
                console.log(err)
            })
    }
    render(){
        return(
            <div id="main-post" className="col-xs-10 col-md-8 col-md-offset-2 col-xs-offset-1 main-content">
                Bookmarks Listing - {this.state.bookmarks.length}
                {
                    this.state.bookmarks.length > 0 ? (<div>
                        {this.state.isLoaded && this.state.bookmarks.map(story => {
                             return <StoryItem 
                             title = {story.title}
                             body = {story.body} 
                             id = {story._id}
                             key = {story._id}
                             author = {story.author} 
                             image = {story.previewImage} 
                             claps = {story.claps} 
                             responses = {story.responses} 
                             bookmarks = {this.state.bookmarksId}
                             handleBookmark = {this.handleBookmark}
                             />
                        })}
                    </div>) : (<div></div>)
                }
            </div>
        )
    }
}