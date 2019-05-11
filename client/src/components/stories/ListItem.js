import React from 'react'
import axios from '../../config/axios'
import { Link } from 'react-router-dom'

const pStyle = {
  height: '55%',
  width: '40%'
  // position: 'relative',
  // top: '50px',
  // left: '1px'
}


const StoryItem = (props) => {
   // console.log('bookmarks', props.bookmarks)
    const bookmarkCheck = () => {
        if(!localStorage.getItem('token')){
            return false
        }
        const flag = props.bookmarks.indexOf(props.id)
        if(flag === -1){
            return false
        }else{
            return true
        }
     }
        return(
            <div>
     <div key = {props.id} className="post-panel">
                
                <div className="post-metadata">
                    <img alt="mark" className="avatar-image" src="https://via.placeholder.com/100x100" height="40" width="40"/>
                    <div className="post-info">{}
                        <div data-react-classname="PopoverLink"><span className="popover-link" data-reactroot=""><Link to ={`/users/profile/${props.author._id}`} >{props.author.username}</Link></span></div>
                        <small>Published • a must read</small>
                    </div>
                    
                </div>
               
                { props.image  ? <div className="post-picture-wrapper">
                    <img src={props.image} style = {pStyle} alt="alt"/>
                </div> : 'Loading Image'}
            
            <div className="main-body">
                
                <h3 className="post-title"><Link key = {props._id} to={`/stories/public/${props.id}`}>{props.title}</Link></h3>
                <div className="post-body">
                    {/* <p className="" dangerouslySetInnerHTML={{__html: props.body}}></p> */}
                    
                    <p className = "">{props.body.slice(0,0.5)}</p>
                    
                </div>
                <Link key = {props._id} to = {`/stories/public/${props.id}`} className="read-more" >Read more</Link>
            </div>
                     
                <div className="post-stats clearfix">
                    <div className="pull-left">
                        <div className="like-button-wrapper">
                            <form className="button_to" method="get" action="">
                                <button disabled = {true} className="like-button" data-behavior="trigger-overlay" type="submit"><i className="fa fa-heart-o"></i><span className="">Like</span></button>
                            </form>
                            <span className="like-count">{props.claps.length}</span>
                        </div>
            
                    </div>
            
                    <div className="pull-right">
                        <div className="bookmark-button-wrapper">
                           
                            <button className="bookmark-button" disabled = {bookmarkCheck()} type="submit" onClick = {() => {return props.handleBookmark(props.id)}}><span className="icon-bookmark-o">{ bookmarkCheck() ? 'Bookmarked' : 'Bookmark'}</span><span className=""></span></button>
                            
                        </div>
            
                    </div>
            
                    <div className="response-count pull-right">
                        <a className="response-count" href="javascript:void(0);">{props.responses.length} responses</a>
                    </div>
                </div>
            </div>
            <hr/>
            </div>
        )
    }
   

 export default StoryItem