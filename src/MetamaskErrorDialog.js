import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';

export default function MetamaskErrorDialog({ openDialog, setOpenDialog }) {
    return (
        <Dialog className='dialog'
            open={openDialog}>
            <IconButton
                aria-label="close"
                onClick={() => setOpenDialog(false)}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}>
                <CloseIcon />
            </IconButton>
            <DialogTitle id="alert-dialog-title">
                {"Metamask Extension Not Detected"}
            </DialogTitle>
            <DialogContent className='content'>
                <DialogContentText id="alert-dialog-description">
                    We couldn't find metamask in your browser.
                    <br /><br />
                    <a href="https://metamask.zendesk.com/hc/en-us" target="_blank">Metamask Support</a>

                </DialogContentText>
            </DialogContent>
        </Dialog>
    )
}

MetamaskErrorDialog.prototypes = {
    openDialog: PropTypes.bool.isRequired,
    setOpenDialog: PropTypes.func.isRequired
}