import React from 'react'
import { Link } from 'react-router-dom'
import FollowButton from '../user/FollowButton'
const ResponseView = (props) => {
    //console.log('response props', props)
    const handleLike = (e) => {
        console.log('liked response')
    }
    return(<div>
            <hr/>
              <div className="post-metadata" data-page="post-metadata-bar">
                <div className="metabar-author-info flex-container flex-space-btw">
        
                        <img alt="mark" className="avatar-image" src="https://via.placeholder.com/100x100" height="40" width="40"/>
                        <div className="username-description">
                        <span><Link to = {`/users/profile/${props.user._id}`}>{props.user.username}</Link></span>
                        </div>
                        
                        {/* <div data-react-className="PopoverLink" ></div> */}
                   
                  </div>
                    
                <hr/>     
            </div>
            <div className="post-info">
                        <span className="pli-title">{props.text}</span>  
                    </div>
            <div className="like-button-wrapper pull-left">
                                <form className="button_to" method="get" action=""><button className="like-button" data-behavior="trigger-overlay" type="submit"><i className="fa fa-heart-o"></i><span className="hide-text">Like</span></button>
                                </form> <span className="like-count">0</span>
                 </div>
        </div>
       )
} 
export default ResponseView
