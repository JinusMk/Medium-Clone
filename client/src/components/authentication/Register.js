import React from 'react'
import axios from 'axios'
import {Link} from 'react-router-dom'

class UserRegister extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            username : '',
            email: '',
            password: '',
            notice: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleSubmit(e){
    e.preventDefault()
    const formData = {
        username: this.state.username,
        email: this.state.email,
        password: this.state.password
    }
    console.log(formData)
    axios.post('http://localhost:3030/users/register', formData)
        .then(()=>{
            this.setState(()=>({
                username: '',
                email: '',
                password: '',
                notice: 'Successfully Registered ! Now taking You to Log In Screen'
            }))
            setTimeout( ()=> {
                this.props.history.push("/users/login")
            },2000)
        })
        .catch(err => {
            console.log(err)
        })
    }

    handleChange(e){
        e.persist()
        this.setState(()=>({
            [e.target.name] : e.target.value
        }))
    }
    render(){
        return(
            <div>
                <h3>Register with us </h3>
                {
                    this.state.notice && <p>{this.state.notice}</p>
                }
                <form onSubmit = {this.handleSubmit}>
                <div className = "form-group">
                    <label>
                        Username
                        <input type = "text" className="form-control" name = "username" value = {this.state.username} placeholder = "Username" onChange = {this.handleChange}/>
                    </label><br/></div>
                    <div className = "form-group">
                    <label>
                        Email
                        <input type = "text" className="form-control" placeholder = "Email address" name = "email" value ={this.state.email} onChange ={this.handleChange}/>
                    </label><br/></div>
                    <div className = "form-group">
                    <label>
                        Password 
                        <input type = "password" className="form-control" name = "password" value = {this.state.password} placeholder = "Password" onChange = {this.handleChange}/>
                    </label><br/></div>
                    <button type = "submit" className="btn btn-secondary">Register</button>

                </form><br/>
                <label>
               Already have an account ?  <Link className = "omniauth-button-group" to = "/users/login">Login </Link> 
           </label>
            </div>
        )
    }
}

export default UserRegister