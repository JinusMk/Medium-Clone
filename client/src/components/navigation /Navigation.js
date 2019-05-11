import React from 'react'
import axios from '../../config/axios'
import {Link} from 'react-router-dom'

class Navigation extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            topics : [],
            isLoaded: false,
            isOpen: false
        }
    }
    toggleOpen = () => this.setState({ isOpen: !this.state.isOpen });
    componentDidMount(){
        axios.get('/topics')
            .then(res => {
                //console.log(res.data)
                this.setState(()=>({
                    topics: res.data,
                    isLoaded: true
                }))
            })
            .catch(err => {
                console.log(err)
            })
    }
    render(){
        const menuClass = `dropdown-menu${this.state.isOpen ? " show" : ""}`;
        return(
            <div id="main-post" className="col-xs-10 col-md-12 col-md-offset-2 col-xs-offset-1 main-content">
                {
                    this.state.isLoaded ? ( <div>
                        <nav className = "navbar navbar-expand-lg navbar-dark bg-dark">
                   <ul className = "navbar-nav">
                   <li className = "nav-item "> <Link className = "nav-link " to = "/">Home</Link></li>
                   {
                       this.state.topics.map(topic => {
                           return <li key = {topic._id} className = "nav-item"> <Link className = "nav-link" to = {`/topics/${topic._id}`} status = {topic._id}>{topic.name}</Link></li>
                       })
                   }
                   <li className="nav-item dropdown">
          <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
         More
        </Link>
      </li>
                   </ul></nav>
                   </div>) : (<div className="d-flex justify-content-center">
                             <div className="spinner-border" role="status">
                             <span className="sr-only">Loading...</span>
                             </div>
                            </div>)
                }
            </div>
        )
    }
}
export default Navigation