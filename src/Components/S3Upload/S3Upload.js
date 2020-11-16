import React, { Component } from "react";
import {Storage } from "aws-amplify";
import {Tooltip, Button} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import { v4 as uuid } from 'uuid';
import {Grid, Divider} from "semantic-ui-react";
import HelpIcon from '@material-ui/icons/Help';
import "./S3Upload.css";

const TextOnlyTooltip = withStyles({
    tooltip: {
        color: "black",
        backgroundColor: "white",
        opacity: 0.5,
        fontSize: "1em"
    }
})(Tooltip);

class S3Upload extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fileInput: {},
            confidence: 50
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        var conf = e.target.value;
        this.setState({confidence: conf});
    }

    async handleSubmit(e) {
        const visibility = 'protected';
        const selectedFile = document.getElementById("fileUpload").files;
        console.log(selectedFile);
        if (!selectedFile.length) {
            return alert("Please choose a file to upload first!");
        }
        const file = selectedFile[0];
        const fileName = file.name;
        const keyName = uuid(); 
        console.log(fileName);
        let info;
        const [, , , extension] = /([^.]+)(\.(\w+))?$/.exec(fileName);
        console.log("Extension is ", extension);
        const mimeType = fileName.slice(fileName.indexOf('.')+1);
        const key = `${keyName}${extension && '.'}${extension}`;
        document.getElementById("submit-btn").className = "ui disabled loading button";
        Storage.put(key, file, {
            level: visibility,
        }).then(
            (result) => {
                info = {
                    key: result.key,
                    keyName: keyName, 
                    confidence: parseInt(document.getElementById("confidence").value),
                    pages: document.getElementById("pages").value.split(","),
                    file_type: mimeType
                }
                console.log(info);
                Storage.put(`file_info/${keyName}.json`, JSON.stringify(info), { level: visibility, contentType: 'json' })
            },
            (err) => {
                return alert('Error uploading file: ', err.message);
            }
        ).then(() => {
            console.log("Finished uploading");
            document.getElementById("submit-btn").className = "ui button";   
        });
    }

    render() {
        //const isSubmitEnabled = this.state.file !== undefined;

        /*<div className="S3Upload">
                <div className="ui divided list">
                    <label for="fileUpload">Upload File (pdf, png, or jpg format only)</label>
                    <div class="ui input">
                        <input id="fileUpload" type="file" />
                    </div>
                    <label for="pages">Pages (seperated with commas)</label>
                    <div className="ui input">
                        <input id="pages" type="text"/>
                    </div>
                    <label for="confidence">Confidence (0-100): </label>
                    <div className="ui input">
                        <input type="number" id="confidence" min="0" max="100" value={this.state.confidence} label="Confidence (0-100)" onChange={this.handleChange} />
                    </div>
                    <TextOnlyTooltip title="Confidence acts as a filter of the results. The recommended default value is 50." aria-setsize="15px">
                        <Button>?</Button>
                    </TextOnlyTooltip>
                </div>
                <button type="submit" id="submit-btn" class="ui button" onClick={this.handleSubmit}>Add File</button>
            </div>*/
        return (
            <Grid style={{marginLeft: "1.66%"}}>
                <Grid.Row>
                    <Grid.Column>
                        <div className={"upload-box"}>
                            <Grid>
                                <Grid.Row style={{padding: "0px"}}>
                                    <Grid.Column verticalAlign={"middle"} textAlign={"left"}>
                                        <div className={"upload-wrapper-top"}>
                                            <span className={"upload-wrapper-top-header"}>Upload File For Processing</span>
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row style={{padding: "0px"}}>
                                    <Grid.Column verticalAlign={"top"} textAlign={"left"}>
                                        <div className={"upload-wrapper-top-bottom"}>
                                            <span className={"upload-wrapper-top-desc"}>Please select a file for upload and fill in the requested fields.</span>
                                            <br/>
                                            <span className={"upload-wrapper-top-desc"}><strong className={"important-text"}> *Only the following file formats are accepted: pdf, png, or jpg format.</strong></span>
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row className={"upload-input-info"}>
                                    <Grid.Column className={"upload-input-info-box"} textAlign={"left"} verticalAlign={"middle"}>
                                        <div className={"upload-input-info-box-inner"}>
                                            <Grid>
                                                <Grid.Row>
                                                    <Grid.Column textAlign={"center"} verticalAlign={"middle"} style={{marginLeft: "15.00%"}}>
                                                        <input id="fileUpload" type="file" />
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                            <Divider />
                                            <div>
                                                <label htmlFor="pages">Pages (separated with commas): </label>
                                                <div className="ui input">
                                                    <input id="pages" type="text"/>
                                                </div>
                                            </div>
                                            <br/>
                                            <div>
                                                <label htmlFor="confidence">Confidence (0-100): </label>
                                                <div className="ui input">
                                                    <span>
                                                        <input type="number" id="confidence" min="0" max="100"
                                                               value={this.state.confidence} label="Confidence (0-100)"
                                                               onChange={this.handleChange}/>
                                                        {' '}
                                                        <TextOnlyTooltip title="Confidence acts as a filter of the results. The recommended default value is 50." aria-setsize="15px" placement="right">
                                                        <HelpIcon style={{marginBottom: "-5px", color: "#313a45"}} />
                                                        </TextOnlyTooltip>
                                                    </span>
                                                </div>
                                            </div>
                                            <Grid>
                                                <Grid.Row>
                                                    <Grid.Column textAlign={"center"} verticalAlign={"middle"} style={{paddingTop: "15px"}}>
                                                        <button type="submit" id="submit-btn" className="ui secondary button"
                                                                onClick={this.handleSubmit}>Add File
                                                        </button>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                            <Divider />
                                            <div>
                                                Some text
                                            </div>
                                        </div>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </div>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

export default S3Upload; 