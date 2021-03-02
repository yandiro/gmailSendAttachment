import React from 'react';

import { useLocation } from "react-router-dom";
import queryString from 'query-string'

import { TextField, Button, IconButton, LinearProgress, Box, Typography } from '@material-ui/core';
import { AddCircle } from '@material-ui/icons';

function useQuery() {
    const query = queryString.parse(useLocation().search)
    const code = query.code;

    // Simple POST request with a JSON body using fetch
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
    };
    fetch(`http://localhost:3333/code/`, requestOptions)
        .then(response => response.json())
}

function LinearProgressWithLabel(props) {
    return (
        <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}


function CreateEmail() {
    useQuery();

    let fileToUpload;

    function handleFileInput(files) {
        fileToUpload = files.item(0);
        handleSendEmail();
    }

    function handleSendEmail() {
        let formData = new FormData();
        const toInputValue = document.querySelector('#email_address').value

        formData.append('to', toInputValue || 'yandiro99@hotmail.com')
        formData.append('file', fileToUpload, fileToUpload.name);

        uploadFile(formData);
        console.log('clearForm()');
    }

    function uploadFile(formData) {
        const requestOptions = {
            method: 'POST',
            body: formData
        };

        fetch('http://localhost:3333/send', requestOptions)
            .then(response => response.json())
            .then((res) => console.log(res))
            .catch(err => console.log(err))
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
                    <LinearProgressWithLabel value={50} />
                </div>

                <div style={styles.bottom}> {/* // bottom part */}
                    <Button variant="contained">Default</Button>
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