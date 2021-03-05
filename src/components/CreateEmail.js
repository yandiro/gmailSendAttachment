import React, { useEffect, useState } from 'react';

import { useLocation } from "react-router-dom";
import queryString from 'query-string'

import { Button, IconButton, Typography, TextField } from '@material-ui/core';
import { AddCircle } from '@material-ui/icons';

import LinearProgressWithLabel from './LinearProgressWithLabel';

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

function CreateEmail() {
    useQuery();

    const [isLinearProgressVisible, setIsLinearProgressVisible] = useState(false);
    const [isLoadingAttachment, setIsLoadingAttachment] = useState(false);
    const [file, setFile] = useState({});
    const [returnedFile, setReturnedFile] = useState({});
    const [sendingResponse, setSendingResponse] = useState();
    const [formValidity, setFormValidity] = useState({ isDirty: false });

    useEffect(() => {
        if (sendingResponse === 'OK') setSendingResponse('Email sent!');
    }, [sendingResponse]);

    function handleSendEmail() {
        setSendingResponse(null)
        if (!formValidity?.isValid && formValidity?.isDirty) {
            setSendingResponse('Form is invalid')
            return
        }
        setIsLinearProgressVisible(true);
        setIsLoadingAttachment(true);

        const toInputValue = document.querySelector('input[id="email"]').value

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
                setSendingResponse(res.message);
                if (res.ok)
                    timerToClearForm(3000);
            })
            .catch(err => {
                console.log('/send: ', err)
            }).finally(() => {
                setIsLinearProgressVisible(false);
                setIsLoadingAttachment(false);
            })
    }

    function timerToClearForm(milliseconds = 0) {
        setTimeout(() => {
            document.getElementById("form").reset();

            setIsLinearProgressVisible(false);
            setFormValidity({ isDirty: false });
            setSendingResponse(null);
            setIsLinearProgressVisible(false);
            setIsLoadingAttachment(false);
        }, milliseconds);
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
                console.log('/uploadfile response: ', res);
                setReturnedFile(res.file);
            })
            .catch(err => {
                console.log('/uploadfile error: ', err);
                console.log(err)
            })
            .finally(() => {
                setIsLoadingAttachment(false);
            })
    }

    function validateEmailInput(element) {
        const isValid = element.validity.valid;
        const isDirty = true;

        setFormValidity(
            {
                isValid,
                helperText: element.validationMessage,
                isDirty
            }
        )
    }

    return (
        <div style={styles.wrapper} >

            <form style={styles.form} id="form">
                <div style={styles.upper}> {/* // superior part */}
                    <div> {/* left Part */}
                        <TextField type="email" id="email" label="Send email to:" fullWidth required
                            helperText={formValidity.helperText} error={!formValidity.isValid && formValidity.isDirty}
                            onChange={(event) => {
                                validateEmailInput(event.target);
                            }} />
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
                    {sendingResponse ? <Typography variant="body2" color="textSecondary" align="center">{sendingResponse}</Typography> :
                        <div>
                            <Typography variant="body2" color="textSecondary" align="right">{isLinearProgressVisible && file.name ? file.name : null}</Typography>
                            <LinearProgressWithLabel isLoading={isLoadingAttachment} isVisible={isLinearProgressVisible} />
                        </div>
                    }
                </div>

                <div style={styles.bottom}> {/* // bottom part */}
                    <Button variant="contained" onClick={e => timerToClearForm()}>Reset</Button>
                    <Button variant="contained" color="primary" onClick={(e) => handleSendEmail()}>
                        Send
                    </Button>
                </div>
            </form>
        </div >
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