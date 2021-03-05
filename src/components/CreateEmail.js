import React, { useState } from 'react';

import { useLocation } from "react-router-dom";
import queryString from 'query-string'

import { TextField, Button, IconButton, LinearProgress, Box, Typography } from '@material-ui/core';
import { AddCircle } from '@material-ui/icons';

function useQuery() {
    const query = queryString.parse(useLocation().search)
    const code = query.code;

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
    };
    fetch(`http://localhost:3333/code/`, requestOptions)
        .then(response => {
            response.json();
            console.log(response);
        })
        .catch(err => {
            console.log(err);
        })
}



function LinearProgressWithLabel(props) {
    if (!props.isVisible) return null
    else if (props.isLoading) {
        return (<>
            <div>{props.isLoading}</div>
            <LinearProgress />
        </>)
    }
    return (
        <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" value={100} />
            </Box>
            <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">100%</Typography>
            </Box>
        </Box>
    );
}


function CreateEmail() {
    const [isLinearProgressVisible, setIsLinearProgressVisible] = useState(false);
    const [isLoadingAttachment, setIsLoadingAttachment] = useState(false);
    const [file, setFile] = useState({});
    const [returnedFile, setReturnedFile] = useState({});

    useQuery();

    function handleSendEmail() {
        const toInputValue = document.querySelector('#email_address').value

        const body = {
            to: toInputValue,
            file: returnedFile
        };

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };

        fetch('http://localhost:3333/send', requestOptions)
            .then(response => response.json())
            .then(res => {
                console.log('/send: ', res);
            })
            .catch(err => { console.log('/send: ', err) })


        console.log('clearForm()');
    }

    function handleFileInput(files) {
        if (!files.length) return

        setFile(files.item(0));
        
        uploadFile(files.item(0));
    }

    function uploadFile(fileToUpload) {
        setIsLoadingAttachment(true);
        setIsLinearProgressVisible(true);

        const formData = new FormData();

        formData.append('file', fileToUpload, fileToUpload.name);

        const requestOptions = {
            method: 'POST',
            body: formData
        };

        fetch('http://localhost:3333/uploadfile', requestOptions)
            .then(response => response.json())
            .then(res => {
                console.log('uploadfile response: ', res);
                setReturnedFile(res.file);
            })
            .catch(err => console.log(err))
            .finally(() => {
                setIsLoadingAttachment(false);
            })
    }

    return (
        <div style={styles.wrapper}>
            <form style={styles.form} id="form">
                <div style={styles.upper}> {/* // superior part */}
                    <div> {/* left Part */}
                        <TextField type="email" id="email_address" label="Send email to:" fullWidth required />
                    </div>
                    <div> {/* right Part */}
                        <input style={{ display: 'none' }} id="upload" type="file" onChange={(e) => handleFileInput(e.target.files)} />
                        <label htmlFor="upload">
                            <IconButton color="primary" aria-label="upload picture" component="span">
                                <AddCircle fontSize="large" />
                            </IconButton>
                        </label>
                    </div>

                </div>

                <div> {/* // middle part */}
                    <Typography variant="body2" color="textSecondary" align="right">{file.name || " "}</Typography>
                    <LinearProgressWithLabel isLoading={isLoadingAttachment} isVisible={isLinearProgressVisible} />
                </div>

                <div style={styles.bottom}> {/* // bottom part */}
                    <Button variant="contained">Reset</Button>
                    <Button variant="contained" color="primary" onClick={(e) => handleSendEmail()}>
                        Send
                    </Button>
                </div>
            </form>
        </div>
    );
}


const styles = {
    bottom: {
        display: 'flex',
        justifyContent: 'space-evenly'
    },
    upper: {
        display: 'grid',
        gridTemplateColumns: '1fr 150px'
    },
    form: {
        width: '50vw',
        height: '30vh',
        minHeight: '300px',
        backgroundColor: 'lightgrey',
        boxSizing: 'border-box',
        padding: '50px',
        display: 'flex',
        flexFlow: 'column nowrap',
        justifyContent: 'space-between'

    },
    wrapper: {
        width: '100vw',
        height: '100vh',
        display: 'grid',
        placeContent: 'center'

    }
};

export default CreateEmail;