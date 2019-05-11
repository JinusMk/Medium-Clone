import React, { Component } from 'react';
import './App.css';
import {BrowserRouter, Route, Link, Switch, Redirect} from 'react-router-dom'
import Home from  './components/layout/Home'
import UserRegister from './components/authentication/Register'
import UserLogin from './components/authentication/Login'
import ListStory from './components/stories/Listing';
import axios from './config/axios';
import CreateStory from './components/stories/CreateStory';
import Navigation from './components/navigation /Navigation'
import UserLogout from './components/authentication/Logout';
import ShowArticles from './components/navigation /ArticlesShow';
import ProfileView from './components/user/profileView'
import StoryView from './components/stories/ViewStory'
import Profile from './components/me/Profile'
import ListMyStory from './components/me/StoriesListing';
import Bookmarks from './components/me/Bookmarks';
import EditStory from './components/stories/EditStory'
import Header from './components/navigation /Header'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      isAuthenticated: !!localStorage.getItem('token')
    }
    this.handleIsAuthenticated = this.handleIsAuthenticated.bind(this)
  }
  handleIsAuthenticated(bool){
    this.setState(()=>({
      isAuthenticated: bool
    }))
  }
  render() {
    
    console.log('render APP.js')
    return (
      <BrowserRouter>
      <div className="App">
      <Header isAuthenticated = {this.state.isAuthenticated}/>
       

      <Switch>
     
      <Route path="/" component = {Home} exact = {true}/>
      <Route path = "/users/register" component = {UserRegister} exact = {true}/>
      <Route path = "/users/login" render = {()=> <UserLogin handleIsAuthenticated = {this.handleIsAuthenticated}/>} exact = {true}/>
      <Route path = "/users/profile/:id" component = {ProfileView} exact = {true}/>
      <Route path = "/users/logout" component = {UserLogout} exact = {true}/>
     
      <Route path = "/users/me" component = {Profile} exact = {true}/>
      <Route path = "/me/stories/drafts" component = {ListMyStory} exact = {true}/>
      <Route path = "/me/stories/public" component = {ListMyStory} exact = {true}/>
      <Route path = "/me/stories/bookmarks" component = {Bookmarks} exact = {true}/>

      <Route path = "/stories/add-new-story" component = {CreateStory} exact = {true}/>
      <Route path = "/stories/public/:id" component = {StoryView} exact = {true}/>
      <Route path = "/stories/:id/edit" component = {EditStory} exact = {true}/>

      <Route path = "/topics/:id" component = {ShowArticles} exact = {true} />
     
      </Switch>
     
      </div>
      </BrowserRouter>
    )
  }
}

export default App;
