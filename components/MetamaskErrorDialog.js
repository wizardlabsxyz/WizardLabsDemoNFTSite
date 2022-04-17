import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';

export default function MetamaskErrorDialog({ openDialog }) {
    return (
        <Dialog className='dialog'
            open={openDialog}>
            <DialogTitle id="alert-dialog-title">
                {"Metamask Extension Not Detected"}
            </DialogTitle>
            <DialogContent className='content'>
                <DialogContentText id="alert-dialog-description">
                    We couldn't find metamask in your browser.
                    <br /><br />
                    <a href="https://metamask.zendesk.com/hc/en-us">Metamask Support</a>

                </DialogContentText>
            </DialogContent>
        </Dialog>
    )
}

MetamaskErrorDialog.prototypes = {
    openDialog: PropTypes.bool.isRequired
}