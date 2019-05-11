import React from 'react'
import axios from '../../config/axios'
import StoryItem from '../stories/ListItem'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser'

class Home extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            articles: [],
            limit: 5,
            bookmarks: []
        }
    }
    loadMyBookmarks = () => {
        axios.get('/users/account')
            .then(response => {
                const user = response.data
                this.setState(()=>({
                    bookmarks: user.bookmarks
                }))
                console.log('article show res.data', user.bookmarks)
            })
            .catch(err => {
                this.setState(()=>({
                    bookmarks : null
                }))
                console.log('/loadBookmarksError', err)

            })
    }


    componentDidMount(){
        this.loadMyBookmarks()
        axios.get('/topics/public')
            .then((response) => {
                const articles = response.data
                articles.map(article =>{
                    const html = article.body
                    return <div>{ article.body = ReactHtmlParser(html) }</div>
                })
                this.setState(()=>({
                    articles 
                }))
            })
            .catch((err) => {
                console.log('Error Home', err)
            })
    }
    

    handleLimit = () => {
        if(this.state.limit >= this.state.articles.length){
            window.alert('Maximum limit of posts reached')
        }else{
            this.setState((prevState) => ({
                limit: prevState.limit + 5
            }))
        }
       
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
                    if(res.data.error === "Already Bookmarked"){
                        //console.log('this')
                        // this.setState(()=>({
                        //     bookmarkFlag: true
                        // }))
                    }
                    window.alert(res.data.error)
                }
            })
            .catch(err => {
                console.log( err)
                window.alert('Please Log in to Bookmark')
                
            })
    }

    render(){
        return(
        <div>
            {/* <h3>Welcome to the App !</h3> */}
            <div>
                <h2>Medium Articles</h2>
                <div>
                <div className="container-fluid main-container">
                    <div className="col-md-6 col-md-offset-1 dashboard-main-content">
                        <div className="posts-wrapper animated fadeInUp" data-behavior="endless-scroll" data-animation="fadeInUp-fadeOutDown">

                            {this.state.articles.reverse().map(story => {
                            return  <StoryItem 
                                    title = {story.title}
                                     body = {story.body} 
                                     id = {story._id}
                                     key = {story._id} 
                                     author = {story.author} 
                                     image = {story.previewImage}
                                     claps = {story.claps} 
                                     responses = {story.responses} 
                                    //  bookmarkFlag = {this.state.bookmarkFlag}
                                    bookmarks = {this.state.bookmarks}
                                     handleBookmark = {this.handleBookmark}/>
                                     
                            })}
                        </div>
                    </div>
                    {/* {this.props.articles ? <AsideFeed _articles={this.props.articles} /> : ''} */}
                    
                </div>

            </div>
            <button className = "btn btn-block btn-outline-secondary" onClick = {this.handleLimit}> Read More</button>
                <small><p> Showing first {this.state.limit} Of {this.state.articles.length} Posts </p></small>
            </div>
        </div>
        )
    }
}
export default Home