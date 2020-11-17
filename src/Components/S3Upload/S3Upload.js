import React, { Component } from "react";
import {Storage } from "aws-amplify";
import {Tooltip, Button} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import { v4 as uuid } from 'uuid';
import {Grid, Divider} from "semantic-ui-react";
import HelpIcon from '@material-ui/icons/Help';
import IconButton from '@material-ui/core/IconButton';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
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
                                                    <Grid.Column textAlign={"center"} verticalAlign={"middle"} style={{marginLeft: "16.00%"}}>
                                                        <input id="fileUpload" type="file" />
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                            <Divider />
                                            <Grid>
                                                <Grid.Row style={{paddingBottom: "0px"}}>
                                                    <Grid.Column textAlign={"center"} verticalAlign={"middle"}>
                                                        <span className={"file-options-header"}><strong>File Options</strong></span>
                                                    </Grid.Column>
                                                </Grid.Row>
                                                <Grid.Row style={{padding: "0px"}}>
                                                    <Grid.Column textAlign={"center"} verticalAlign={"top"}>
                                                        <span className={"file-options-subheader"}>(* indicates a required field)</span>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                            <br/>
                                            <Grid>
                                                <Grid.Row style={{paddingBottom: "0px"}}>
                                                    <Grid.Column textAlign={"center"} verticalAlign={"middle"}>
                                                        <label htmlFor="pages"><strong>*Pages (separated with commas):</strong></label>
                                                    </Grid.Column>
                                                </Grid.Row>
                                                <Grid.Row style={{padding: "0px"}}>
                                                    <Grid.Column textAlign={"center"} verticalAlign={"middle"}>
                                                        <div className="ui input">
                                                            <input id="pages" type="text" placeholder={"eg. 1,3,5,7"}/>
                                                        </div>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                            <br/>
                                            <Grid>
                                                <Grid.Row style={{paddingBottom: "0px"}}>
                                                    <Grid.Column textAlign={"center"} verticalAlign={"middle"}>
                                                        <span>
                                                            <label htmlFor="confidence"><strong>*Confidence (0-100):</strong></label>
                                                            <TextOnlyTooltip title="Confidence acts as a filter of the results. The recommended default value is 50." aria-setsize="15px" placement="right">
                                                            <IconButton style={{padding: "0px"}}>
                                                                <HelpIcon style={{color: "#313a45"}} />
                                                            </IconButton>
                                                        </TextOnlyTooltip>
                                                        </span>
                                                    </Grid.Column>
                                                </Grid.Row>
                                                <Grid.Row style={{padding: "0px"}}>
                                                    <Grid.Column textAlign={"center"} verticalAlign={"middle"}>
                                                        <input type="number" id="confidence" min="0" max="100"
                                                               value={this.state.confidence} label="Confidence (0-100)"
                                                               onChange={this.handleChange}/>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                            <Grid>
                                                <Grid.Row>
                                                    <Grid.Column textAlign={"center"} verticalAlign={"middle"} style={{paddingTop: "15px"}}>
                                                        <button type="submit" id="submit-btn" className="ui secondary button"
                                                                onClick={this.handleSubmit}>
                                                            <Grid>
                                                                <Grid.Row columns={2} style={{marginLeft: "-7px"}}>
                                                                    <Grid.Column width={12} textAlign={"middle"} verticalAlign={"middle"}>
                                                                        Process File
                                                                    </Grid.Column>
                                                                    <Grid.Column width={4} style={{marginLeft: "-7px"}} textAlign={"middle"} verticalAlign={"middle"}>
                                                                        <CloudUploadIcon/>
                                                                    </Grid.Column>
                                                                </Grid.Row>
                                                            </Grid>
                                                        </button>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                            <Divider />
                                            <div>
                                                <span className={"post-processing-info"}>After the file is processed, the output data will appear in the table to the right.</span>
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