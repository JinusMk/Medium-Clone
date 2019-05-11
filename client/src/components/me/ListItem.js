import React from 'react'
import axios from '../../config/axios'
import { Link } from 'react-router-dom'
const pStyle = {
    height: '35%',
    width: '20%'
    // position: 'relative',
    // top: '50px',
    // left: '1px'
  }

const ListItem =  (props) => {
    const flag = props.isPublished // const { isPublished } = props
    console.log('ListItem', flag)
    console.log('image', props.image)
    // const imageSource = `http://localhost:3030/${props.image}`    
    // console.log('ImageSource', imageSource)
    
    return(
            <div>
             {
            flag ? (<div>
<hr/>
<div className="post-metadata">
                    <img alt="mark" className="avatar-image" src="https://via.placeholder.com/100x100" height="40" width="40"/>
                    <div className="post-info">
                        <div data-react-classname="PopoverLink"><span className="popover-link" data-reactroot=""><Link to = {`/users/me`}>Written-by-You</Link></span></div>
                        <small>Published • a must read</small>
                    </div>
                </div>
                {
                    
                    props.image  ? <div  className = "">
                   
                    <img style={ pStyle } src={props.image} alt="alt"/>
                
                </div> : ''
            

                 }
 <div key = {props.id} className="post-panel">       
     <div className="main-body">
         <h3 className="post-title"><Link key = {props._id} to={`/stories/public/${props.id}`}>{props.title}</Link></h3>
         <div className="post-body">
             {/* <p className="" dangerouslySetInnerHTML={{__html: props.body}}></p> */}
             <span className = ""><span>{props.body.slice(0,0.5)}</span></span>
         </div>
         <Link key = {props._id} to = {`/stories/public/${props.id}`} className="read-more" >Read more</Link>
         <br/>
     </div>
 
     <div className="post-stats clearfix">
         <div className="pull-left">
             <div className="like-button-wrapper">
                 <form className="button_to" method="get" action="">
                     <button className="like-button" disabled data-behavior="trigger-overlay" type="submit"><i className="fa fa-heart-o"></i><span className="">Clap</span></button>
                 </form>
                 <span className="like-count">{props.claps.length}</span>
             </div>
 
         </div>
         <div className="response-count pull-right">
              <Link to = {`/stories/public/${props.id}`}>{props.responses.length} responses</Link>
          </div>
     
 </div>
 <hr/> 
   </div>
            </div>) : (<div key = {props.id} className="post-panel">       
            <div className="main-body">
                <h3 className="post-title"><Link key = {props.id} to={`/stories/${props.id}/edit`}>{props.title}</Link></h3>
                <div className="post-body">
                    {/* <p className="" dangerouslySetInnerHTML={{__html: props.body}}></p> */}
                    <span className = ""><span>{props.body}</span></span>
                </div>
                <Link key = {props._id} to = {`/stories/${props.id}/edit`} className="read-more" >Edit Now</Link>
                <hr/>
            </div></div>)
        }
 
       </div>
    )
}
 export default ListItem

 //   const Div = {
// position: 'absolute',
// top: '80px',
// left: '0'
//   }
  //.post-picture-wrapper{padding:2em 0}body.posts.show .post-picture-wrapper img{display:block;width:100%;margin:auto}
//   const divStyle = {
//       display: 'block',
//       width: '100%',
//       margin: 'auto'
//   }