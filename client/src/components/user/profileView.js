import React from 'react'
import axios from '../../config/axios'
import FollowButton from './FollowButton'
import {Link, Redirect} from 'react-router-dom'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser'

const pStyle = {
    width: '25%',
    height: '20%'
}

export default class ProfileView extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            profile: '',
            isLoaded: false,
            me: false

        }
    }
    componentDidMount = () =>{  //to do postman testing
        const id = this.props.match.params.id

        console.log('profile id ', id)
        axios.get(`/users/profile/${id}`)
            .then((response)=>{
                console.log('profile', response.data)
                const profile = response.data
               console.log('profile', profile)
               const stories =  profile.stories.filter(story => {
                   return story.isPublished == true
               })
               stories.reverse().map(story =>{
                const html = story.body
                return <div>{ story.body = ReactHtmlParser(html) }</div>
            })
               console.log('published articles', stories)
               this.setState(()=>({
                profile,
                isLoaded: true,
                articles: stories
            }))
              
            })
            .catch(err => {
                console.log(err)
               // window.alert('OOPS!')
            })
    }
    handleFollowButtonChange = () => {
        console.log('ButtonChangeCalled - viewStory')
        this.setState(()=>({
            me: true
        }))
    }
    handleBookmark = (story_id) => {
        console.log('Bookmark Clicked', story_id)
    }

    render(){
        // console.log('render fn', this.state.profile)
        // if( this.state.profile.client != null){
        //     <Redirect to = "/users/me">/</Redirect>
        // }
        // console.log('profile view client', this.state.profile.client)
        return(
        <div>
        <div>
            {
                this.state.me && <Redirect to = "/users/me" /> 
            }
        </div>
            
            <div>
                {
                    this.state.isLoaded ? (<div>
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
                                            <div>{this.state.profile.user.username ? <FollowButton user={`${this.state.profile.user.username}`} to_follow={`${this.state.profile.user._id}`} handleFollowButtonChange = {this.handleFollowButtonChange}/> : ''}</div>
                                        </div>
                                    </div>
            
                                </div>
                            </div>
                        </div>
            
                        <div className="posts-wrapper animated fadeInUp" data-animation="fadeInUp-fadeOutDown">
            <br/>
            <h4 className="small-heading border-top">Stories</h4>
            { this.state.articles.map((story)=>
            
            <div key = {story._id} className="post-panel">
            
                <div className="post-metadata">
                    <img alt="mark" className="avatar-image" src="https://via.placeholder.com/100x100" height="40" width="40"/>
                    <div className="post-info">
                        <div data-react-classname="PopoverLink"><span className="popover-link" data-reactroot=""><a href="javascript:void(0);">{this.state.profile.user.username}</a></span></div>
                        <small>Published • a must read</small>
                    </div>
                </div>
            
            
                {story.previewImage  ? <div className="post-picture-wrapper">
                    <img src={story.previewImage} style = {pStyle} alt="alt"/>
                </div> : ''}
            
                <div className="main-body">
                    <h3 className="post-title"><Link to={`/stories/public/${story._id}`}>{story.title}</Link></h3>
                    <div className="post-body">
                        {story.body.slice(0,1)}
                    </div>
                    <Link to = {`/stories/public/${story._id}`} className="read-more" >Read more</Link>
                </div>
            
                <div className="post-stats clearfix">
                    <div className="pull-left">
                        <div className="like-button-wrapper">
                            <form className="button_to" method="get" action="">
                                <button className="like-button" data-behavior="trigger-overlay" type="submit"><i className="fa fa-heart-o"></i><span className="hide-text">Clap</span></button>
                            </form>
                            <span className="like-count">{story.claps.length}</span>
                        </div>
            
                    </div>
            
                    <div className="pull-right">
                        <div className="bookmark-button-wrapper">
                            <form className="button_to" method="get" action=""><button onClick = {()=>{
                                this.handleBookmark(story._id)
                            }} className="bookmark-button" data-behavior="trigger-overlay" type="submit"><span className="icon-bookmark-o"></span><span className="hide-text">Bookmark</span></button>
                            </form>
                        </div>
            
                    </div>
            
                    <div className="response-count pull-right">
                        <a className="response-count" href="javascript:void(0);">{story.responses.length} responses</a>
                    </div>
                </div>
            </div>
            )}
            
            </div>
            
            </div>
            </div>
            
            
                        </div></div>) : (<div><h2>Loading ...!</h2></div>)
                }
            </div>
            </div>
        )
    }
}