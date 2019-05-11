import React from 'react'
import axios from '../../config/axios'
import {Link} from 'react-router-dom'
import ListItem from './ListItem'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser'


export default class ListMyStory extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            stories: [],
            flag: ''
           
        }
    }
    componentWillReceiveProps(nextProps){
        const path = nextProps.match.path
        //console.log('cwrp- path', path)
        if(path == "/me/stories/drafts"){
            this.setState(()=>({
             flag: false
            }))
           this.loadStories('drafts')
        }else if(path == "/me/stories/public"){
            this.setState(()=>({
                flag: true
            }))
           // console.log('cwrp - /published', this.state.flag)
            this.loadStories('public')
        }
      
}
    componentDidMount(){
       // console.log('prop object', this.props.match.path)
        const path = this.props.match.path
        if(path == "/me/stories/drafts"){
           this.setState(()=>({
            flag: false
           }))
          this.loadStories('drafts')
          
        }else if(path == "/me/stories/public"){
            this.setState(()=>({
                flag: true
            }))
            //console.log('cdm - /published', this.state.flag)
            this.loadStories('public')
        }
    }
    loadStories = (flag) => {
       // console.log('path', `/stories/${flag}`)
        axios.get(`/stories/${flag}`)
        .then(response => {
           // console.log('List story', response.data)
            const stories = response.data
            stories.map(story => {
                const html = story.body
                return <div>{ story.body = ReactHtmlParser(html) }</div>;
            })
            //console.log('List stories', stories)
            this.setState(()=>({
                stories
            }))
        })
        .catch(err => {
            console.log(err)
        })
    }
 
    render(){
        //console.log('listing Render', this.state.flag)
        return(
            <div id="main-post" className="col-xs-10 col-md-8 col-md-offset-2 col-xs-offset-1 main-content">
                <h4>Listing Story - {this.state.stories.length}</h4>
                        <Link className = "" to = "/stories/add-new-story">Add New Story</Link>
                 <ul className="nav nav-pills nav-justified">
                     <li className="nav-item">
                    <Link to ="/me/stories/drafts" className = "nav-link"><h3 className="small-heading border-top"> Drafts </h3></Link>
                        </li>
                    <li className="nav-item">
                   <Link to ="/me/stories/public" className = "nav-link"><h3 className="small-heading border-top"> Published </h3></Link> 
                        </li>
                
                </ul>

                {
                    this.state.flag ? (<div className = "container">
                        <div className = "row">
                            <div className = "col-md-12">
                            {
                              this.state.stories.length > 0 ?  (this.state.stories.map(story => {
                                    return <ListItem key = {story._id} isPublished = {this.state.flag} title = {story.title} body = {story.body} id = {story._id} key = {story._id} author = {story.author.username} responses = {story.responses} image = {story.previewImage} claps = {story.claps}/>
                                })) : (<div><h3>You have no published stories yet, Add new story <Link to = "/stories/add-new-story">here</Link></h3></div>)
                            }
                            </div>
                        
                        </div>
                    
                    
                    
                    </div>):(
                    <div>
                        
                       
                        <div className = "container">
            <div className = "row">
                <div className = "col-md-11">
               
                {
                 this.state.stories.length > 0 ?  (this.state.stories.map(story => {
                        return(
                           <ListItem title = {story.title} isPublished = {false} body = {story.body} id = {story._id} key = {story._id}  />
                        )
                      
                    })) : (<div><center><h3>You have no drafts yet, add your first story <Link to = "/stories/add-new-story">here</Link></h3></center></div>)
                }
               
                </div>

            </div>

            </div>
                    </div>
                )}
           
            </div>
        )
    }
}

