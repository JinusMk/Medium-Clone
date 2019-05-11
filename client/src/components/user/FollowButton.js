import React from 'react'
import axios from '../../config/axios'


class FollowButton extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            user: '',
            user_id: this.props.to_follow ? this.props.to_follow : '',
            flag: '',
            isLoaded: false
        }
    }
    componentDidMount = () => {
        axios.get('/users/account')
            .then(response => {
                console.log('Follow Button - Current User :', response.data)
                const user = response.data
                if(user.bookmarks.indexOf(this.props.storyId) != -1){
                    this.props.handleBookmarkFlag(true)
                }
                this.setState(()=>({
                    user,
                    isLoaded: true
                }))
                if(user._id == this.props.to_follow){
                    this.props.handleFollowButtonChange()
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    handleClick = () => {
        const user_id = this.props.to_follow
        console.log('user id ',user_id)
        axios.post('/users/follow',{user_id})
            .then(response => {
                console.log(response.data)
                if(response.data.msg == "followed"){
                    window.location.reload()
                    this.setState(()=>({
                        flag: "Following"
                    }))
                }else if(response.data.msg == "you can't follow yourself"){
                    window.alert(response.data.msg)
                    this.setState(()=>({
                        flag: "Follow Me"
                    }))
                }else if(response.data.err == "Already following"){
                    console.log('inside this')
                   if(window.confirm(`Do you want to unfollow ${this.props.user}?`)) {
                    axios.post('/users/unfollow', {user_id})
                        .then(response => {
                            console.log(response.data)
                            window.location.reload()
                        })
                        .catch(err => {
                            console.log(err)
                        })
                   }
                  
                    this.setState(()=>({
                        flag: "Following"
                    }))
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
    render(){
        {
           if(this.state.isLoaded == true){
            let following = this.state.user.following //following list of current user 
            // console.log('following', following)
            // console.log('to_follow', this.props.to_follow)
             const f = following.indexOf(this.props.to_follow)
            //console.log('render ',f)
            return(
                <div>
                    <div>
                        <div onClick = {this.handleClick} data-reactroot =""><button className={f === -1 ? "button green-border-button follow-button" : "button green-inner-button follow-button"} href="javascript:void(0);">{f === -1 ? 'Follow':'Following'}</button></div>
                    </div>
                </div>
            )
           }else{
               return (<button className = "button green-border-button follow-button" onClick = {() => {window.alert('Please sign in to follow a user')}}>Follow</button>)
           }
        }
        
    }

}

export default FollowButton