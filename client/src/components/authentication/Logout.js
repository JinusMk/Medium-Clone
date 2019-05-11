import React from 'react'
import axios from '../../config/axios'
import {Redirect} from 'react-router-dom'

export default function UserLogout(props){
    const confirm = window.confirm('Are you sure?')
    if(confirm == true){
        localStorage.clear()
        axios.defaults.headers['x-auth'] = null
        window.location.reload()
        return(
            <Redirect to = "/users/login"></Redirect>
        )
    }else{
        return(
            <Redirect to = "/"></Redirect>
        )
    }
}