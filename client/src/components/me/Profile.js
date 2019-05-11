import React from 'react'
import axios from '../../config/axios'
import StoryItem from '../stories/ListItem'

export default class Profile extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            profile: '',
            clappedStories: '',
            bookmarks: [],
            isLoaded: false

        }
    }
    componentDidMount = () =>{  //to do postman testing
        axios.get('/users/account')
            .then(response => {
                const id = response.data._id
                axios.get(`/users/profile/${id}`)
                    .then(response => {
                        //console.log('me profile', response.data)
                        const profile = response.data
                        const clappedStories = profile.user.clappedStories
                        const bookmarks = profile.user.bookmarks
                       
                        if(clappedStories.length > 0 ){
                            clappedStories.map(story => {
                                axios.get(`/users/${story.author}`)
                                    .then(res => {
                                        console.log('/author Details', res.data)
                                        story.author = res.data
                                        this.setState(()=>({
                                            isLoaded: true
                                        }))
                                    })
                                    .catch(err => {
                                        console.log('/users/:id', err)
                                    })
                            })
                        }
                        this.setState(() => ({
                            profile,
                            clappedStories,
                            bookmarks
                        }))
                       
                    })
                    .catch(err => {
                        window.alert(err)
                        console.log(err)
                    })
            })
            .catch(err => {
                console.log(err)
            })

    }
    handleBookmark = (story_id) => {
        console.log('Bookmark Clicked Home show ', story_id)
        axios.post(`/stories/${story_id}/bookmark`, {story_id})
            .then(res => {
                console.log(res.data)
                if(res.data.msg === "Done"){
                    this.setState((prevState)=>({
                        bookmarks: [...prevState.bookmarks, story_id]
                    }))
                }else if(res.data.error){
                    // if(res.data.error === "Already Bookmarked"){
                    // }
                    window.alert(res.data.error)
                }
            })
            .catch(err => {
                console.log( err)
                window.alert('Please Log in to Bookmark')
                
            })
    }
    render(){
        console.log('clappedstories', this.state.clappedStories)
        return(
            <div id="main-post" className="col-xs-10 col-md-8 col-md-offset-2 col-xs-offset-1 main-content">
                {
                    this.state.profile != '' ? (<div>
                        <div>
                            <div className="users show">
                        <div className="container-fluid main-container">
                        <div className="banner-container animated fadeInUp-small" data-animation="fadeInUp-fadeOutDown-slow">
                            <div className="hero-wrapper">
                                <header className="hero">
                                    <div className="profile-info">
                                        <h1 className="hero-title">{this.state.profile.user.username}</h1>
                                        <p className="hero-description">{this.state.profile.user.email}</p>
                                        <div className="hero-location">
                                            {/* <i className="fa fa-map-marker"></i>{items.profile.user.provider} */}
                                        </div>
                                    </div>
                                    <div className="hero-avatar">
                                        <img alt={this.state.profile.user.username} className="avatar-image" src="https://via.placeholder.com/100x100" height="100" width="100"/>
                                    </div>
                                </header>
                                <div>
                                    <div data-react-classname="UserFollowContainer" data-react-props="{&quot;followerCount&quot;:6,&quot;followingCount&quot;:2,&quot;following&quot;:false,&quot;followed_id&quot;:396,&quot;hideButton&quot;:false,&quot;username&quot;:&quot;mark&quot;,&quot;overlayTrigger&quot;:true}">
                                        <div data-reactroot="">
                                            <div className="following-metadata"><span className="following-count"><span><span><b>{this.state.profile.user.following.length}</b> Following </span></span>
                                                </span><span className="follower-count"><span><span><b>{this.state.profile.user.followers.length}</b> Followers</span></span><br/><br/>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
            
                                </div>
                            </div>
                        </div>
            
                        <div className="posts-wrapper animated fadeInUp" data-animation="fadeInUp-fadeOutDown">
            <br/><hr/>
            <h4>Clapped Stories - {this.state.clappedStories.length }</h4><hr/>
                    {
                        this.state.clappedStories.length > 0 ? (<div>
                            {
                               this.state.isLoaded && this.state.clappedStories.map(story => {
                                    return <StoryItem 
                                    title = {story.title}
                                    body = {story.body} 
                                    id = {story._id}
                                    key = {story._id}
                                    author = {story.author} 
                                    image = {story.previewImage} 
                                    claps = {story.claps} 
                                    responses = {story.responses} 
                                     bookmarks = {this.state.bookmarks}
                                    handleBookmark = {this.handleBookmark}/>
                                })
                            }
                        </div>) : (<div></div>)
                    }
            
            </div>
            
            </div>
            </div>
            
            
                        </div></div>) : (<div><h2>Loading ...!</h2></div>)
                }
            </div>
        )
    }
}