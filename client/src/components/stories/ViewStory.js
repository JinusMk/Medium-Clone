import React from 'react'
import axios from '../../config/axios'
import { Link } from 'react-router-dom'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser'
import Response from './ResponseView'
import FollowButton from '../user/FollowButton'
import uuid from 'uuid'

const pStyle = {
    height: '80%',
    width: '80%'
    // position: 'relative',
    // top: '50px',
    // left: '1px'
  }
export default class StoryView extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            title : '',
            topic: '',
            body: '',
            author: '',
            claps: '',
            responses: '',
            isLoaded: false,
            clapsCount: '',
            comment: '',
            isPublished: '' ,
            imageSrc: '',
            tags: [],
            me: false,
            tokenFlag: false

        }
    }
    componentDidMount = () =>{
        axios.get(`/stories/public/${this.props.match.params.id}`)
            .then(response => {
               // console.log('cdm story view ', response.data)
                const story = response.data
               // console.log('story loaded', story)
                const html = story.body
                story.body = ReactHtmlParser(html) 
                var clapsCount = 0
              //  console.log('story cdm2', story)
              for(let i = 0; i < story.claps.length; i++){
                  clapsCount += story.claps[i].count 
              }  
             // console.log('claps count /viewstory ', clapsCount)
             // console.log('claps', story.claps)
                this.setState(()=>({
                    id: story._id,
                    title: story.title,
                    topic: story.topic.name,
                    body: story.body,
                    author: story.author,
                    claps: story.claps,
                    isLoaded: true,
                    clapsCount,
                    responses: story.responses,
                    isPublished: story.isPublished, 
                    tags: story.tags,
                    imageSrc: story.previewImage
                    
                }))

                //console.log('this.state' ,this.state)
            })
            .catch(err => {
                console.log(err)
                
            })

            if(localStorage.getItem('token')){
                this.setState(()=>({
                    tokenFlag : true
                }))
            }
    }

    handleClap = (story_id) => {

      //  console.log('Clapped id', story_id)
        axios.post(`/stories/${story_id}/clap`, {story_id})
            .then(res => {
                //console.log('clap response', res.data)
                if(res.data.msg == "Done"){
                    this.setState((prevState)=>({
                        clapsCount : prevState.clapsCount + 1
                    }))
                }
                if(res.data.error){
                    window.alert(res.data.error)
                }
            })
            .catch(err => {
                //window.alert(err.msg)
                console.log('error clap/viewstory', err)
                
            })
      
    }
    handleCommentSubmit = (e) => {
        e.preventDefault()
       // console.log('commented -> ', this.state.comment)
        const formData = {
            story_id: this.props.match.params.id,
            comment: this.state.comment 
        }
        axios.post(`/stories/${this.props.match.params.id}/comment`, formData)
            .then(res => {
                //console.log('view story/comment', res.data)
                this.setState(()=>({
                    responses: [...this.state.responses, res.data.response ]
                }))
                console.log('this.state', this.state.responses)
            })
            .catch(err => {
                window.alert(err)
                console.log('error- commentng ', err)
            })
        this.setState(() => ({
            comment: ''
        }))
    }
    handleCommentChange = (e) => {
        e.persist()
        this.setState(() => ({
            comment: e.target.value
        }))
    }

handleFollowButtonChange = () => {
    //console.log('ButtonChangeCalled - viewStory')
    this.setState(()=>({
        me: true
    }))
}

handleBookmark = (story_id) => {
    //console.log('Bookmark clicked with Id', story_id)
    axios.post(`/stories/${story_id}/bookmark`, {story_id})
        .then(res => {
            if(res.data.msg === "Done"){
                this.setState(()=>({
                    bookmarkFlag: true
                }))
            }else if(res.data.error){
                if(res.data.error === "Already Bookmarked"){
                    //console.log('this')
                    this.setState(()=>({
                        bookmarkFlag: true
                    }))
                }
                window.alert(res.data.error)
            }
        })
        .catch(err => {
            console.log(err)
        })
}
handleBookmarkFlag = (flag) => {
    this.setState(()=>({
        bookmarkFlag: flag
    }))
}
    
    render(){
        console.log('me', this.state.me)
        return(
           
             <div>
                <div className="container-fluid main-container">
                <div className="row animated fadeInUp" data-animation="fadeInUp-fadeOutDown">
                    <div id="main-post" className="col-xs-10 col-md-8 col-md-offset-2 col-xs-offset-1 main-content">
                        <br/> 
                        <div>
                        <span className="post-metadata">
                            <img alt={this.state.author.username} className="avatar-image" src="https://via.placeholder.com/100x100" height="40" width="40" />
                            <span className="post-info">
                                <div data-react-classname="PopoverLink" data-react-props="{&quot;user_id&quot;:608,&quot;url&quot;:&quot;/users/netk&quot;,&quot;children&quot;:&quot;netk&quot;}"><span className="popover-link" data-reactroot=""><Link to={this.state.me ? `/users/me` : `/users/profile/${this.state.author._id}` }>{this.state.me ? 'Written by you' :this.state.author.username}</Link></span></div>
                                <small>Published • nice story</small>
                            </span>
                        </span>
                        <div className="pull-right">{
                        }
                            {this.state.author ? (!this.state.me && <FollowButton 
                                                                        user = {`${this.state.author.username}`} 
                                                                        to_follow = {this.state.author._id} 
                                                                        handleFollowButtonChange = {this.handleFollowButtonChange}
                                                                        storyId = {this.state.id}
                                                                        handleBookmarkFlag = {this.handleBookmarkFlag}
                                                                        /> ): ''}
                        </div>
                        </div>
                        
                        <br/>

                        {!this.state.imageSrc || !this.state.imageSrc.length > 0 ? '' : <div className="post-picture-wrapper">
                            <img src={this.state.imageSrc} style = {pStyle} alt="feature img 540" />
                        </div> }

                        <h1 className="">{this.state.title}</h1>
                        <br/>
                        <div className="body">
                            <br/>
                            {this.state.body} 
                        </div>
                        <br/><br/>
                        <div className = "pull-left">
                            <div className="post-tags">
                            {
                                this.state.tags.map(tag => {
                                    return <Link key = {tag._id} to = {`/tagged/${tag._id}`} className="tag" >{tag.name}</Link> 
                                })
                            }
                             </div>
                         </div><br/><br/>

                        <div className="post-stats clearfix">
                            <div className="pull-left">
                                <div className="like-button-wrapper">{
                                    this.state.tokenFlag ? (<div> <button onClick={() => this.handleClap(this.state.id)} className="like-button" data-behavior="trigger-overlay" type="submit">
                                    <i className="fa fa-heart-o"></i><span>Clap</span> <span className="like-count">{this.state.clapsCount}</span>
                                    </button></div>) : (<div> <button onClick={() => window.alert('Please signin to clap this story')} className="like-button" data-behavior="trigger-overlay" type="submit">
                                    <i className="fa fa-heart-o"></i><span>Clap</span> <span className="like-count">{this.state.clapsCount}</span>
                                    </button></div>)
                                }
                                   
                                    
                                </div>
                            </div>
                            <div className="pull-left">
                           
                                <a className="response-icon-wrapper" href="#">
                                    <i className="fa fa-heart-o">Responses </i>
                                    <span className="like-count" data-behavior="response-count">{this.state.responses.length}</span>
                                </a>
                                
                            </div>

                            <div className="pull-right">{
                                this.state.tokenFlag ? (<div><div className="bookmark-button-wrapper">
                                <button className="" onClick = {()=>{return this.handleBookmark(this.props.match.params.id)}} data-behavior="trigger-overlay" type="submit">{this.state.bookmarkFlag ? 'Bookmarked' : 'Bookmark' }</button>
                           </div></div>) : (<div><div className="bookmark-button-wrapper">
                                     <button className="" onClick = {()=> window.alert('Please sign in to add Bookmark')} data-behavior="trigger-overlay" type="submit">{this.state.bookmarkFlag ? 'Bookmarked' : 'Bookmark' }</button>
                                </div></div>)
                            }
                                
                            </div>

                        </div>
                            <br/><br/>
                        <div className="author-info">
                            <div clas="author-metadata">
                                <img alt={this.state.author.username} className="avatar-image" src="https://via.placeholder.com/100x100" height="50" width="50" />
                                <div className="username-description">
                                    <Link to={this.state.me ? `/users/me` : `/users/profile/${this.state.author._id}` }><h4>{this.state.me ? 'Written by you' :this.state.author.username}</h4></Link>
                                    <div>
                            {this.state.author ? (!this.state.me && <FollowButton 
                                                                        user = {`${this.state.author.username}`} 
                                                                        to_follow = {this.state.author._id} 
                                                                        handleFollowButtonChange = {this.handleFollowButtonChange}
                                                                        storyId = {this.state.id}
                                                                        handleBookmarkFlag = {this.handleBookmarkFlag}
                                                                        /> ): ''}
                        </div>
                                </div>
                            </div>
                            {/* {this.state.author ? <FollowButton user={`${this.state.author.username}`} to_follow={this.state.author._id} /> : ''} */}
                        </div>
                            <br/><br/>
                    </div>
                </div>
                
{/* 
                <div className="post-show-footer row animated fadeInUp" data-animation="fadeInUp-fadeOutDown">
                    <div className="col-xs-10 col-md-6 col-xs-offset-1 col-md-offset-3 main-content related-stories">
                        <h4 className="small-heading">Related stories</h4>
                        <div className="post-list-item">
                            <div className="flex-container">
                                <div className="avatar-wrapper">
                                    <img alt="" className="avatar-image" src="" height="40" width="40" />
                                </div>
                                <div className="post-info">
                                    <strong className="pli-title"><a href="#"></a></strong><br/>
                                    <small className="pli-username"><a href="#"></a></small>
                                </div>
                            </div>
                        </div>

                    </div> */}

                    <div id="responses" className="col-xs-10 col-md-6 col-xs-offset-1 col-md-offset-3 main-content">
                        <h4 className="small-heading">Responses - {this.state.responses.length}</h4>
                      
                            {
                             this.state.responses.length > 0 &&   this.state.responses.reverse().map(comment => {
                                    return <Response key = {uuid()} user = {comment.user} text = {comment.text} />
                                })
                            }
                            <br/><br/>
                            <div>
                             <form onSubmit = {this.handleCommentSubmit}>
                                <input type ="text" rows = "2" cols = "10" onChange = {this.handleCommentChange} value = {this.state.comment} placeholder = "Write a response..."/>
                                <input type = "submit"/>
                             </form>
                             <br/><br/>
                            </div>
                        </div>
                     </div>  
            </div>
            // </div>
        )
    }
}

 