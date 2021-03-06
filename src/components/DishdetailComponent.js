﻿import React,{Component} from 'react';
import {Card,CardImg,CardText,CardBody,CardTitle,Breadcrumb,BreadcrumbItem,Modal,ModalHeader, ModalBody,
     FormGroup,Label,Row,Col,Button} from 'reactstrap';
import {Control,LocalForm,Errors} from 'react-redux-form';
import {Link} from 'react-router-dom';
import {Loading} from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';


const maxLength=(len)=>(val)=>!(val)||(val.length<=len);
const minLength = (len) => (val) => val && (val.length >= len);

class CommentForm extends Component{
    constructor(props){
        super(props);


        this.state={
            isModalOpen:false

        };
        this.toggleModal = this.toggleModal.bind(this);


    }
    toggleModal()
    {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }
    handleSubmitComment(values){
        this.toggleModal();
       this.props.postComment(this.props.dishId,values.rating,values.author,values.comment);
    }


    render(){


        return (
            <div>
                <Button outline onClick={this.toggleModal}><span className="fa fa-pencil fa-lg"></span>Submit comment</Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleSubmitComment(values)}>
                            <FormGroup>

                                    <Label htmlFor="rating">
                                        Rating
                                    </Label>
                                    <Col>
                                        <Control.select model=".rating" id="rating" name="rating" className="form-control">
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                        </Control.select>
                                    </Col>
                                </FormGroup>
                            <FormGroup>
                                <Label htmlFor="author">Your Name</Label>
                                <Col>
                                <Control.text model=".author" id="author" name="author"
                                              placeholder="Your Name"
                                              className="form-control"
                                              validators={{
                                                  minLength: minLength(3), maxLength: maxLength(15)
                                              }}
                                />
                                </Col>
                                <Errors
                                    className="text-danger"
                                    model=".author"
                                    show="touched"
                                    messages={{
                                        minLength: 'Must be greater than 2 characters',
                                        maxLength: 'Must be 15 characters or less'
                                    }}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label htmlFor="comment" md={2}>Comment</Label>
                                <Col>
                                <Control.textarea model=".comment" id="comment" name="comment"
                                                  rows="12"
                                                  className="form-control"
                                />
                                </Col>
                            </FormGroup>
                            <Button type="submit" value="submit" color="primary">Submit</Button>
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}


     function  RenderComments({comments,postComment,dishId}){
        if (comments==null){
            return (<div></div>)
        }
        const cmmts=comments.map(comment=>{
            return(
                <li key={comment.id}>
                    <p>{comment.comment}</p>
                    <p>{comment.author}
                    &nbsp;
                    {new Intl.DateTimeFormat('en-US',{
                    year:'numeric',
                    month:'long',
                    day:'2-digit'
                    }).format(new Date(Date.parse(comment.date)))
                    }
                    </p>
                </li>
            )
        })
        return(
            <div className='col-12 col-md-5 m-1'>
                <h4>Comments</h4>
                <ul className='list-unstyled'>
                    {cmmts}
                </ul>
                <CommentForm dishId={dishId} postComment={postComment} />
            </div>
        )
    }
   function RenderDish({dish}) {
        if (dish != null) {
            return (
                <div className='col-12 col-md-5 m-1'>
                    <Card>
                     <CardImg top src={baseUrl + dish.image} alt={dish.name} />
                         <CardBody>
                            <CardTitle>{dish.name}</CardTitle>
                                 <CardText>{dish.description}</CardText>
                         </CardBody>
                    </Card>
                </div>
                    )
                }
                    else {
                    return (<div></div>)
                }
                }

    const DishDetail=(props)=> {
        if (props.isLoading) {
            return (
                <div className="container">
                    <div className="row">
                        <Loading/>
                    </div>
                </div>
            );
        }
        else if (props.errMess) {
            return (
                <div className="container">
                    <div className="row">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            );
        }


        else if (props.dish != null) {
            return (
                <div className="container">
                    <div className="row">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                        </Breadcrumb>
                        <div className="col-12">
                            <h3>{props.dish.name}</h3>
                            <hr/>
                        </div>
                    </div>
                    <div className='row'>
                        <RenderDish dish={props.dish}/>
                        <RenderComments comments={props.comments} postComment={props.postComment} dishId={props.dish.id}/>

                    </div>
                </div>
            );
        }

    }



export default DishDetail;