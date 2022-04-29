import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';

export default function NetworkErrorDialog({ openDialog, setOpenDialog }) {

    async function switchNetwork() {
        window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: '0x4' }],
        });
    }

    return (
        <Dialog className='dialog'
            open={openDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
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
                {"Not Connected to Rinkeby Network"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    You aren't connected to the right blockchain network
                    <br /><br />
                    <button
                        className='button w-inline-block'
                        onClick={() => {
                            switchNetwork().then(() => {
                                console.log('ok');
                            })
                        }}>Switch Network</button>

                </DialogContentText>
            </DialogContent>
        </Dialog>
    )
}


NetworkErrorDialog.prototypes = {
    openDialog: PropTypes.bool.isRequired,
    setOpenDialog: PropTypes.func.isRequired
}