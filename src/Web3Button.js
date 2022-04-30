import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { ethers } from "ethers";

import MetamaskErrorDialog from './MetamaskErrorDialog.js';
import NetworkErrorDialog from './NetworkErrorDialog.js';
import FailedMintDialog from './FailedMintDialog.js';

test

function Web3Button() {

    const SUPPORTED_NETWORKS = ['rinkeby'];
    const CONTRACT_ADDRESS = '0x18ec80a549f88bf97ea34955e1d290daf55e3fd7';
    const ETHERSCAN_API_KEY = 'QVB4196QUXYZFKARZ946HECK665QN7X88S';

    const [contractABI, setContractABI] = useState(undefined);
    const [provider, setProvider] = useState(undefined);
    const [signer, setSigner] = useState(undefined);
    const [signerAddress, setSignerAddress] = useState(undefined);
    const [isConnected, setConnected] = useState(false);
    const [networkSupported, setNetworkSupported] = useState(undefined);
    const [openMetamaskDialog, setOpenMetamaskDialog] = useState(false);
    const [openNetworkDialog, setOpenNetworkDialog] = useState(false);
    const [openFailedMintDialog, setOpenFailedMintDialog] = useState(false);

    // Check for provider and set signer if available
    useEffect(() => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            setProvider(provider);

            const signer = provider.getSigner();
            signer.getAddress().then((address) => {
                setSigner(signer);
                setSignerAddress(address);
                setConnected(true);

                console.log('connected - signer set - ' + address);
            });
        } catch (error) {
            console.log('provider or signer not found: ' + error);
        }
    }, [isConnected])

    // Check current network
    useEffect(() => {
        if (provider) {
            provider.getNetwork().then((network) => {
                if (!SUPPORTED_NETWORKS.includes(network.name)) {
                    console.log('detected unsupported network');
                    setNetworkSupported(false);
                    reset();
                } else {
                    setNetworkSupported(true);
                }
            });
        }
    }, [provider])

    useEffect(() => {
        if (window.ethereum) {

            async function listenMMAccount() {
                window.ethereum.on("accountsChanged", async function () {
                    window.location.reload();
                });
            }

            async function listenMMNetwork() {
                window.ethereum.on("chainChanged", async function () {
                    window.location.reload();
                });
            }

            listenMMAccount();
            listenMMNetwork();
        }
    }, []);

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

    async function connect() {
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const signerAddress = await signer.getAddress();

        setSigner(signer);
        setSignerAddress(signerAddress);
    }

    async function mint() {
        console.log('attempting mint for: ' + signerAddress);

        try {
            const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

            await contract.connect(signer).mint(
                signerAddress,
                1,
                { value: ethers.utils.parseEther(".05") }
            );
        } catch (error) {
            console.log('failed to connect for mint: ' + error);
            setOpenFailedMintDialog(true);
            throw error;
        }
    }

    function reset() {
        setSigner(undefined);
        setSignerAddress(undefined);
        setConnected(false);
    }

    return (
        <>
            <NetworkErrorDialog openDialog={openNetworkDialog} setOpenDialog={setOpenNetworkDialog} />
            <MetamaskErrorDialog openDialog={openMetamaskDialog} setOpenDialog={setOpenMetamaskDialog} />
            <FailedMintDialog openDialog={openFailedMintDialog} setOpenDialog={setOpenFailedMintDialog} />

            {!isConnected && <div
                onClick={() => {
                    if (!provider) {
                        setOpenMetamaskDialog(true);
                    } else if (!networkSupported) {
                        setOpenNetworkDialog(true);
                    } else {
                        connect()
                            .then(() => {
                                console.log('connected');
                                setConnected(true);
                            }).catch((error) => {
                                console.log('failed to connect: ' + error);
                            });
                    }
                }}>
                Connect
            </div>}
            {isConnected && <div
                onClick={() => {
                    mint()
                        .then(() => {
                            console.log('minted');
                        })
                        .catch((error) => {
                            console.log('failed to mint: ' + error);
                        });
                }}>
                Mint
            </div>}
        </>
    )
}

ReactDOM.render(
    React.createElement(Web3Button, {}, null),
    document.getElementById('web3-button')
);