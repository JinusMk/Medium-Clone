import React from 'react'
import axios from '../../config/axios'
import { Form } from 'react-bootstrap';

class Topic extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            topics: [],
            topicValue: ''
        }
        this.selectChange = this.selectChange.bind(this)
    }
    componentDidMount = () => {
        axios.get('/topics')
            .then(response => {
                this.setState(()=>({
                    topics: response.data
                }))
            })
            .catch(err => {
                console.log(err)
            })
    }
    selectChange(e){
        e.persist()
        const topicValue = e.target.value
       // console.log('topicVal', topicValue)
        this.setState(()=>({
            topicValue
        }))
        this.props.handleTopicChange(topicValue)
    }
    render(){
        return(
            <div>
                <Form.Label>
                    Select Topic
                    <Form.Control as = "select" className="form-control" onChange = {this.selectChange} value = {this.state.topicValue}>
                    <option value = ""> Select </option>
                        {this.state.topics.map(topic => {
                            return (
                                <option key = {topic._id} value = {topic._id}>{topic.name}</option>
                            )
                        })}
                    </Form.Control>
                </Form.Label>
            </div>
        )
    }
}
export default Topic