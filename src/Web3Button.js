import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { ethers } from "ethers";

import MetamaskErrorDialog from './MetamaskErrorDialog.js';
import NetworkErrorDialog from './NetworkErrorDialog.js';
import { func } from 'prop-types';


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

    useEffect(() => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            setProvider(provider);

            provider.getNetwork().then((network) => {
                if (!SUPPORTED_NETWORKS.includes(network.name)) {
                    console.log('detected unsupported network');
                    setNetworkSupported(false);
                    reset();
                } else {
                    setNetworkSupported(true);
                }
            });
        } catch (error) {
            console.log('provider not found');
        }
    }, [])

    useEffect(() => {
        if (window.ethereum) {

            window.ethereum.request({ method: 'eth_accounts' })
                .then((accounts) => {
                    if (!_.isEmpty(accounts)) {
                        console.log('wallet is connected');
                        setConnected(true);
                    }
                }).catch((error) => {
                    console.log('error requesting accounts: ' + error);
                });

            async function listenMMAccount() {
                window.ethereum.on("accountsChanged", async function (accounts) {
                    console.log('accounts changed');
                    if (_.isEmpty(accounts)) {
                        reset();
                    } else {
                        setConnected(true);
                    }
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

    function reset() {
        setSigner(undefined);
        setSignerAddress(undefined);
        setConnected(false);
    }

    return (
        <>
            <NetworkErrorDialog openDialog={openNetworkDialog} setOpenDialog={setOpenNetworkDialog} />
            <MetamaskErrorDialog openDialog={openMetamaskDialog} setOpenDialog={setOpenMetamaskDialog} />

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