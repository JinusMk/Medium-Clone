import React from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import unemojify from 'node-emojify'
import draftToHtml from 'draftjs-to-html'; 
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import {Form} from 'react-bootstrap'
import Topic from './TopicShow'
import PublishButton from './PublishButton';
import FormData from 'form-data'
//import StoryTags from './Tags'
import axios from '../../config/axios'

class StoryForm extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      editorState: EditorState.createEmpty(),
      title:'',
      topic:'',
      body: '',
      tags:'',
      imgSrc: null
    }
    this.handleTitleChange=this.handleTitleChange.bind(this)
    
    this.handleTagChange=this.handleTagChange.bind(this)
    this.handleSubmit=this.handleSubmit.bind(this)
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
  }
  
  onEditorStateChange = (editorState) => {
    const newValue = unemojify(
      draftToHtml(convertToRaw(editorState.getCurrentContent()))
    )
    //console.log('OnEidtorsChange ', newValue)
    this.setState({
      editorState, body: newValue
    })
  }

  handleTitleChange (e) { 
    const title = e.target.value
    this.setState(() => ({title}))
  }
  
  handleTopicChange = (topic) => {
    this.setState(()=>({
        topic
    }))
}
  handleTagChange (tags) { //this we getting from props and that we will be setting in the state
    console.log('Story Form Tags', tags)
    this.setState( () => ({tags}))

  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps', nextProps)
    // const { title,body,selectedTopic,tagOptions,editorState } = nextProps.story
    // this.setState(()=>({title,body,selectedTopic,editorState,tagOptions}))
  }
  
  handleSubmit (e) {
    e.preventDefault()
    const formData = {
      title:this.state.title,
      topic:this.state.topic,
      //tagOptions:this.state.tagOptions,
      body:this.state.body
    }
    this.props.handleSubmit(formData)
    this.setState(() => ({
      title:'',
      topic:'',
      editorState : '',
      tags:'',
      loading: false
    }))
  }
publishStory = (imgSrc) => {
   // console.log('Publish Story Form Clicked', imgSrc)
    this.setState(()=>({imgSrc, loading: true}))
    //console.log('this.state ', this.state)
    console.log('story form publishing ')


const formData = {
    title: this.state.title,
    topic: this.state.topic,
    body: this.state.body,
    previewImage: imgSrc,
    isPublished: true,
    tags: this.state.tags
}

console.log('formData Publish', formData)
this.props.handleSubmit(formData)

this.setState(() => ({
    title:'',
    topic:'',
    editorState : '',
    tags:'',
    loading: false
  }))
}
  render(){
  //console.log(this.state.topic,"state topic")
    const { editorState } = this.state;
    //console.log('story form states', this.state)
    return(
      <div id="main-post" className="col-xs-10 col-md-8 col-md-offset-2 col-xs-offset-1 main-content">
         <br/>
          <PublishButton publish = {this.publishStory} loading = {this.state.loading} handleTagChange = {this.handleTagChange} /><br/>

        <Form onSubmit={this.handleSubmit} className="editor-form main-editor" >
                 <Form.Group controlId="exampleForm.ControlInput1">
                      <Form.Label className="form-group">Title</Form.Label>
                     <Form.Control type='text' value={this.state.title}  onChange={this.handleTitleChange}/><br/>
                 </Form.Group>
                 <Form.Group controlId="exampleForm.ControlSelect1">
                    <Topic className="form-group" handleTopicChange={this.handleTopicChange}/>  
                 </Form.Group>
          <Editor
            className = "editor-form main-editor" 
            editorState={editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={this.onEditorStateChange}
            // onChange={this.onChange}
          />
          <button type='submit' className="button green-border-button">  Save draft</button>
        </Form>
        
      </div>
    )
  }
}
 export default StoryForm

 //     const formData = new FormData()

//     formData.append('title', this.state.title)
//     formData.append('previewImage', imgSrc)
//     formData.append('topic', this.state.topic)
//     formData.append('tags', this.state.tags)
//     formData.append('body', this.state.body)
//     //console.log('formData title Story Form ->', formData.get('title'))

//    // this.props.handleSubmit(formData, 'public')
//    axios({
//     method: 'post',
//     url: '/stories/test',
//     data: formData,
//      headers: {'Content-Type': 'multipart/form-data; boundary=${form._boundary}'}
// })

    // .then(response => {
    //        window.alert('suucessfully published')
    //      console.log('publish create story -> ', response.data)
    // })
    // .catch(err => {
    // console.log('error create story', err)
    // })
    // 

    //    for(let i = 0 ; i < tags.length; i++){
//        if(tags[i].name){
//            console.log('new tag ->', tags[i])
//        }
//    }
    