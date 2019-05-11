import React from 'react'
import axios from '../../config/axios'
import { Link } from 'react-router-dom'
import { Modal, Button } from 'react-bootstrap'
import TagSelect from './TagSelect'



export default class PublishButton extends React.Component{ 
    constructor(props, context) {
        super(props, context);
    
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    
        this.state = {
          show: false,
          tagSuggesstion : [],
          isLoaded: false,
          imgSrc: null

        };
      }
      componentDidMount = () => {
        axios.get('/tags')
            .then(response => {
                const tagSuggestions = response.data
                console.log('tag suggestions in publish buttom',tagSuggestions)
                this.setState(()=>({
                   tagSuggestions,
                   isLoaded: true
                }))
            })
    }
      handleClose() {
        this.setState({ show: false });
      }
    
      handleShow() {
        this.setState({ show: true });
        
      }
      handlePublishClick = () => {
          console.log('Publish CLicked')
          this.setState({ show: false })
          this.props.publish(this.state.imgSrc)

      }

    uploadImage = (e) => {
      
        const file = this.refs.fileUploader.files[0]
       // console.log('file Img Publish btn ', file)
        const formData = new FormData()
        formData.append('previewImage', file)
        const config = { headers: { 'Content-Type': 'multipart/form-data' } }
        axios.post('/upload', formData, config)
            .then(response => {
               // console.log('/upload res.data', response.data)
                const path = response.data.path
                this.setState(()=>({
                    imgSrc: path
                }))
                console.log(response.data.msg)
            })
            .catch(err => {
                console.log('Error publishBtn', err)
            })
    }
      render() {
          // console.log('this.props ', this.state)
        return (
          <>
            <Button variant="primary" className="publish-button "  onClick={this.handleShow}>Publish Now?
            </Button>
            
            <Modal show={this.state.show} onHide={this.handleClose} style={{opacity:1}} size = "lg" centered>
              <Modal.Header closeButton>
                <Modal.Title><h6 className="modal-title" >Story Preview</h6></Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className = "row">
                <div className={this.state.imgSrc != null ? 'file-upload-previewer' : 'file-upload-previewer hidden'}>
                  <img src="" alt="" id="image_preview"/>
                </div>
                <div className="form-group">
                  <span className="picture_upload">
                    <i className="fa fa-camera" onClick={this.handleClick}></i>
                  </span>
                </div>
                <form>
                  <div className = "col-md-6">
                  
                     <label>
                        Include a high quality image to your story        
                         <input type = "file" onChange = {() => {this.uploadImage()}} id = "file" ref = "fileUploader" ></input>     
                      </label><br/>
                  </div>
                  <div className = "col-md-6">
             <label>
             Add or change tags
           {
               this.state.isLoaded &&  <TagSelect handleTagChange = {this.props.handleTagChange} suggestions = {this.state.tagSuggestions} ></TagSelect>
           } 
             </label><br/>
             </div>
             
         </form>
      </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" className = "publish-button " onClick={this.handleClose}>
                  Schedule later
                </Button>
                <Button variant="primary" className="publish-button " onClick={this.handlePublishClick}>
                  Publish Now
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        );
      }
    }
    
