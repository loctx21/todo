import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Modal, ModalHeader, ModalBody, ModalFooter, Col, Button, 
    FormGroup, Label, Row } from 'reactstrap'
import * as Yup from 'yup'
import { Formik, Form, Field, ErrorMessage } from 'formik'

import DatePicker from "react-datepicker"
import subDays from "date-fns/subDays"
import "react-datepicker/dist/react-datepicker.css"

import moment from 'moment'

class ItemModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modal : true,
            error: null,
            sucess: null
        }
    }

    render() {
        const { values } = this.props
        const { error, success } = this.state

        return (
            <Modal isOpen={this.state.modal} toggle={this.toggle} className=""
                onClosed={() => this.props.onClosed()} size={"md"} backdrop="static">
                <ModalHeader toggle={this.toggle}>
                    {this.title}
                </ModalHeader>
                <Formik
                    validationSchema={ItemSchema}
                    onSubmit={this.handleSubmit}
                    initialValues={ values }
                >
                {({ values, setFieldValue, isSubmitting }) => (
                    <Form>
                        <ModalBody>
                            <FormGroup className="row">
                                <Label className="col-sm-3 control-label"
                                    htmlFor="name"
                                >
                                    Name <span className="text-danger">*</span>
                                </Label>
                                <Col sm={9}>
                                    <Field name="name" id="name" as="input" 
                                        placeholder="Item name"
                                        className="form-control"
                                    />
                                    <ErrorMessage component="span" className="text-danger" name="name" />
                                </Col>
                            </FormGroup> 
                            <FormGroup className="row">
                                <Label className="col-sm-3 control-label"
                                    htmlFor="description"
                                >
                                    Description
                                </Label>
                                <Col sm={9}>
                                    <Field name="description" id="description" as="textarea" 
                                        placeholder="Description"
                                        className="form-control"
                                    />
                                    <ErrorMessage name="description" />
                                </Col>
                            </FormGroup> 
                            <FormGroup className="row">
                                <Label className="col-sm-3 control-label"
                                    htmlFor="due_at"
                                >
                                    Due at
                                </Label>
                                <Col sm={9}>
                                    <div>
                                        <DatePicker selected={values.due_at} 
                                            onChange={(value) => setFieldValue('due_at', value)}
                                            dateFormat="yyyy-MM-dd HH:mm" 
                                            showTimeSelect
                                            minDate={subDays(new Date(), 0)}
                                            timeFormat="HH:mm" timeIntervals={1}
                                            className="form-control"
                                        />   
                                        <Field name="due_at">
                                        {({ field, form, meta }) => (
                                        <input name="due_at"
                                            type="hidden" 
                                            className="form-control"
                                            value={values.due_at}
                                        />
                                        )}
                                        </Field>
                                    </div>
                                </Col>
                            </FormGroup> 
                            {
                                values.id && 
                                <FormGroup className="row">
                                    <Label className="col-sm-3 control-label"
                                        htmlFor="status"
                                    >
                                        Status
                                    </Label>
                                    <Col sm={9}>
                                        <Field name="status">
                                        {({ field, form, meta }) => (
                                        <div className="form-check form-check-inline">
                                            <input type="checkbox" {...field} 
                                                id="status" 
                                                checked={field.value}
                                                value="true"
                                                name="status"
                                                className="form-check-input"
                                            />
                                            {values.done_at &&
                                                <label className="form-check-label" htmlFor="status">Done at: {values.done_at}</label>
                                            }
                                        </div>
                                        )}
                                        </Field>
                                    </Col>
                                </FormGroup>
                            }
                            { error != null &&
                                <div className="alert alert-danger alert-dismissable">{error}</div>
                            }
                            { success != null &&
                                <div className="alert alert-primary alert-dismissable">{success}</div>
                            }
                        </ModalBody>
                        <ModalFooter>
                            <div className="text-right">
                                <Button type="submit" disabled={isSubmitting} color="primary">
                                    Save
                                </Button>
                            </div>
                        </ModalFooter>
                    </Form>
                )}
                </Formik>
            </Modal>
        )
    }
    
    get title()
    {
        const { values } = this.props

        if (values.hasOwnProperty('id'))
            return 'Edit item'
        
        return 'Create new item'
    }

    toggle = (e) => {
        this.setState({
            modal: false
        })
    }

    handleSubmit = (values, {setSubmitting, resetForm}) => {
        setSubmitting(true)
        this.props.onSubmit(values)
            .then(resp => {
                if (values.id) {
                    this.setState({success: "Saved sucessfully!"})
                    resetForm()
                }
                else
                    this.toggle()
            }).catch(resp => {
                console.log(resp)
                this.setState({error : `${resp.data.message}. Please try again!`})
            })
            .finally(resp => {
                setSubmitting(false)
            });
    }
}

ItemModal.propTypes = {
    values: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClosed: PropTypes.func.isRequired
}

const ItemSchema = Yup.object().shape({
    name: Yup.string()
        .required('Required').max(50)
})

export default ItemModal