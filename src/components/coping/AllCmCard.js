import React, { Component } from "react";
import { FiEdit, FiXSquare } from "react-icons/fi";
import { IconContext } from "react-icons";
import API from "../db/API";
import { getUserFromLocalStorage } from '../login/LoginHandler'

import { Button, Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { thisTypeAnnotation } from "@babel/types";

import { FiX } from "react-icons/fi"

const theUserIdIs = getUserFromLocalStorage()

export default class AllCmCard extends Component {

    state = {
        showinfo: false,
        editModal: false,
        userId: theUserIdIs.id,
        editTitle: this.props.copingMechTitle,
        editUrl: this.props.copingMechUrl,
        editInfo: this.props.copingMechInfo,
        editInfo2: this.props.copingMechInfo2,
        editCopingLabel: "Select a mood category for this coping mechanism",
        editCopingMoodCategoryId: this.props.copingMechMoodCategory
    }

    handleFieldChange = evt => {
        const stateToChange = {};
        stateToChange[evt.target.id] = evt.target.value;
        this.setState(stateToChange);
    };


    toggleEditModal = () => {
        this.setState(prevState => ({
            editModal: !prevState.modal
        }));
    }

    toggleExpansion = () => {
        this.setState({ showinfo: !this.state.showinfo })
    }

    updateCmForm = (value) => {
        const newObj = {
            id: value,
            userId: this.state.userId,
            title: this.state.editTitle,
            url: this.state.editUrl,
            info: this.state.editInfo,
            info2: this.state.editInfo2,
            moodCategoryId: parseInt(this.state.editCopingMoodCategoryId)
        }
        console.log("update", newObj)
        let newState = {
            allCopingMechs: [],
            editModal: !this.state.editModal
        }

        API.editCopingMech(newObj.id, newObj)
            .then(results => console.log(results))
    }


    render() {
        return (
            <>
                <article key={this.props.copingMechId} className="card" onDoubleClick={this.toggleEditModal}>
                    <div className="thumb" style={{ backgroundImage: `url(${this.props.copingMechUrl})` }}></div>
                    <div className="infos">
                        <h2 className="title">{this.props.copingMechTitle}</h2>
                        <h3 className="date">{this.props.copingMechInfo}</h3>
                        <p className="txt">{this.props.copingMechInfo2}</p>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                    </div>
                </article>
                <Modal size="lg" isOpen={this.state.editModal} className={this.props.className} centered={true}>
                    <ModalHeader charCode="Y">
                        Edit Coping Mechanism
                    </ModalHeader>
                    <ModalBody>
                        < Form >
                            <FormGroup>
                                <Label for="editTitle">Title</Label>
                                <Input type="text" name="title" id="editTitle" onChange={this.handleFieldChange} defaultValue={this.props.copingMechTitle} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="editInfo">Description</Label>
                                <Input type="text" name="info" id="editInfo" onChange={this.handleFieldChange} defaultValue={this.props.copingMechInfo} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="editInfo2">Additional Information</Label>
                                <Input type="text" name="editInfo2" id="editInfo2" onChange={this.handleFieldChange} defaultValue={this.props.copingMechInfo2} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="editUrl">Image Url</Label>
                                <Input type="text" name="url" id="editUrl" onChange={this.handleFieldChange} defaultValue={this.props.copingMechUrl} />
                            </FormGroup>
                            <Input type="select" id="editCopingMoodCategoryId" onChange={this.handleFieldChange} value={this.props.copingMechMoodCategory}>
                                <option ></option>
                                <option value={5}>Great</option>
                                <option value={4}>Good</option>
                                <option value={3}>Okay</option>
                                <option value={2}>Not So Great</option>
                                <option value={1}>Bad</option>
                            </Input>
                        </Form >
                    </ModalBody>
                    <ModalFooter>
                        <button className="colin-button" onClick={() => this.updateCmForm(this.props.copingMechId)}>Submit Edit</button>
                    </ModalFooter>
                </Modal>
            </>
        )
    }
}
