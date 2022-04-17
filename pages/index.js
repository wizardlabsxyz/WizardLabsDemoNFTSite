import _ from 'lodash';
import Header from '@components/Header'

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { ethers } from "ethers";
import { useEffect, useState } from 'react';

export default function Home() {

    const SUPPORTED_NETWORKS = ['rinkeby'];
    const CONTRACT_ADDRESS = '0x18ec80a549f88bf97ea34955e1d290daf55e3fd7';
    const ETHERSCAN_API_KEY = 'QVB4196QUXYZFKARZ946HECK665QN7X88S';

    const [contractABI, setContractABI] = useState(undefined);
    const [provider, setProvider] = useState(undefined);
    const [signer, setSigner] = useState(undefined);
    const [signerAddress, setSignerAddress] = useState(undefined);
    const [isConnected, setConnected] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            setProvider(provider);

            provider.getNetwork().then((network) => {
                if (!SUPPORTED_NETWORKS.includes(network.name)) {
                    console.log('detected unsupported network');
                }
            });
        } catch (error) {
            console.log('provider not found');
            setOpenDialog(true);
        }
    }, [])

    useEffect(() => {
        fetch(`https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${CONTRACT_ADDRESS}&apikey=${ETHERSCAN_API_KEY}`
        ).then(res => res.json())
            .then(({ result }) => {
                if (result != null) {
                    setContractABI(result);
                } else {
                    console.error('Unable to resolve ABI');
                }
            });
    }, []);

    useEffect(() => {
        if (window.ethereum) {
            async function listenMMAccount() {
                window.ethereum.on("accountsChanged", async function () {
                    console.log('accounts changed');
                    window.location.reload();
                });
            }
            async function listenMMNetwork() {
                window.ethereum.on("chainChanged", async function () {
                    console.log('chain changed');
                    window.location.reload();
                });
            }
            listenMMAccount();
            listenMMNetwork();
        }
    }, []);

    async function connect() {
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const signerAddress = await signer.getAddress();

        setSigner(signer);
        setSignerAddress(signerAddress);
    }

    async function mint() {
        console.log('minting');
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

        await contract.connect(signer).mint(
            signerAddress,
            1,
            { value: ethers.utils.parseEther(".05") }
        );
    }

    return (
        <div className="container">
            <Dialog
                open={openDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    {"Metamask Extension not Detected!"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        We couldn't find metamask in your browser.
                        <br/><br/>
                        <a href="https://metamask.zendesk.com/hc/en-us">Metamask Support</a>

                    </DialogContentText>
                </DialogContent>
            </Dialog>
            <main>
                <Header title="Welcome to WizardLabsNFT" />
                {!isConnected && <Button
                    variant="contained"
                    onClick={() => {
                        connect()
                            .then(() => {
                                console.log('connected');
                                setConnected(true);
                            }).catch((error) => {
                                console.log('failed to mint');
                                console.log(error);
                            });
                    }}>
                    Connect
                </Button>}
                {isConnected && <Button
                    variant="contained"
                    onClick={() => {
                        mint().then(() => {
                            console.log('minted');
                        })
                    }}>
                    MINT
                </Button>}
            </main>
        </div>
    );
}
