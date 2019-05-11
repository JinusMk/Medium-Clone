import React from 'react'
import {Link } from 'react-router-dom'
import Navigation from './Navigation'
import axios from '../../config/axios';

export default class Header extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            isOpen : false
        }
    }

    toggleOpen = () => this.setState({ isOpen: !this.state.isOpen });
    render(){
        const menuClass = `dropdown-menu${this.state.isOpen ? " show" : ""}`;
        const pathname = window.location.pathname
        console.log('pathname navigation', pathname.includes('/stories'))
        return(
            <div>
             <nav className="navbar navbar-default navbar-fixed-top is-inView">
       <a className="navbar-brand" id="logo" href="/">
                    <img alt="" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Medium_logo_Wordmark_Black.svg/380px-Medium_logo_Wordmark_Black.svg.png" height="100" width="100"/>
                </a>
            
      
       <form className="form-inline">
    <input className="form-control mr-sm-2" type="search" placeholder="Search Medium" aria-label="Search"/>
    {/* <button className="btn btn-outline-secondary my-2 my-sm-0" onClick = {() => {console.log('search clicked')}} type="submit">Search</button> */}
     </form>
     {
       this.props.isAuthenticated ? (<div className="btn-group" onClick={this.toggleOpen}>
       <button type="button" className="buttonUser" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      User
        </button>
     <div className={menuClass}>
        <Link to = "/" className = "dropdown-item">Home</Link>
        <Link to = "/me/stories/bookmarks" className="dropdown-item" >Bookmarks</Link>
        <Link to = "/stories/add-new-story" className = "dropdown-item">New Story</Link>
        <Link to = "/me/stories/drafts" className="dropdown-item" >Stories</Link>
        <Link to = {`/users/me`} className="dropdown-item">Profile</Link>
        <Link to = "/users/logout" className="dropdown-item" type="link">logout</Link>
    </div>
   </div>) : (<div><Link className = "button green-border-button" to = "/users/login"> Sign in / Register </Link>
              </div>)

     }
      </nav>
      <div>
        {
          !pathname.includes('/stories') ? (
          <div>
            <nav className = "navbar navbar-expand-lg navbar bg-dark">
              <ul className = "navbar-nav">
               <li className = "nav-item">  <Navigation/></li> 
              </ul>
            </nav>
           </div>):(
            <div>
              {/* <nav className = "navbar navbar-expand-lg navbar-dark bg-dark">
            <ul className="navbar-nav ">
            <Navigation></Navigation>
             </ul>
             </nav> */}
           </div>)
        }
       
       
        </div>
         </div>
        )
    }
}
