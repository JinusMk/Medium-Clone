import React from 'react'
import axios from '../../config/axios'
import {Link, Redirect} from 'react-router-dom'

class UserLogin extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            email: '',
            password: '',
            notice: '',
          redirect: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleChange(e){
        e.persist()
        this.setState(()=> ({
            [e.target.name]: e.target.value
        }))
    }
    handleSubmit(e){
        e.preventDefault()
        const formData = {
            email : this.state.email,
            password : this.state.password
        }
        console.log(formData)
        axios.post("/users/login", formData)
            .then(res => {
                axios.defaults.headers["x-auth"] = res.data.token // token
                localStorage.setItem('token', res.data.token)  
                this.props.handleIsAuthenticated(true) //this.props.history.push("/stories")
                this.setState(()=>({
                    redirect : true
                }))
             })
             .catch(err => {
                 window.alert('Invalid email/password')
                 console.log(err)
                 this.setState(()=>({
                     password: '',
                     notice: err
                 }))
             })
    }
    render(){
        if(this.state.redirect){
            return <Redirect to="/users/me"/>
        }
        return(
         <div>
             <h3>Sign In</h3>
            <form onSubmit = {this.handleSubmit}>
                <div className = "form-group">
                <label htmlFor="exampleInputEmail1"> Email
                    <input type = "text" className="form-control" name = "email" value = {this.state.email} onChange = {this.handleChange} aria-describedby="emailHelp" placeholder="Enter email" />
                    </label> </div>
                <div className = "form-group">
                <label htmlFor="exampleInputPassword1">
                    Password
                    <input type = "password" className="form-control" name = "password" value = {this.state.password} onChange = {this.handleChange} placeholder="Password"/>
                    </label></div>
                <button type = "submit" className="btn btn-secondary">Log In</button>

           </form><br/>
           <label>
               Don't have an account ?  <Link className = "omniauth-button google" to = "/users/register">Register Now</Link> 
           </label>

         </div>

        )
    }

}

export default UserLogin
