import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';

export default function NetworkErrorDialog({ openDialog }) {

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
    openDialog: PropTypes.bool.isRequired
}