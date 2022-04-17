import _ from 'lodash';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
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
        <div>
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
                        <br /><br />
                        <a href="https://metamask.zendesk.com/hc/en-us">Metamask Support</a>

                    </DialogContentText>
                </DialogContent>
            </Dialog>
            <div data-collapse="medium" data-animation="default" data-duration="400" data-easing="ease" data-easing2="ease" role="banner" className="navigation w-nav"></div>
            <div className="section cc-store-home-wrap">
                <div className="intro-header">
                    <div className="intro-content cc-homepage">
                        <div className="intro-text">
                            <div className="heading-jumbo">Welcome to Wizard Labs</div>
                            <div className="paragraph-bigger cc-bigger-white-light">This is a demonstration of our mint website solution<br /></div>
                            {!isConnected && <Button
                                className='button w-inline-block'
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
                                className='button w-inline-block'
                                variant="contained"
                                onClick={() => {
                                    mint().then(() => {
                                        console.log('minted');
                                    })
                                }}>
                                MINT
                            </Button>}
                        </div>
                        <div id="custom-bo"></div>
                    </div>
                </div>
                <div className="container">
                    <div className="motto-wrap">
                        <div className="label cc-light">What we believe in</div>
                        <div className="heading-jumbo-small">Grow your business, establish your brand, and put your customers first.<br /></div>
                    </div>
                    <div className="divider"></div>
                    <div className="home-content-wrap">
                        <div className="w-layout-grid about-grid">
                            <div id="w-node-_86e64837-0616-515b-4568-76c147234d34-8257984c">
                                <div className="home-section-wrap">
                                    <div className="label cc-light">About</div>
                                    <h2 className="section-heading">Who we are</h2>
                                    <p className="paragraph-light">Nulla vel sodales tellus, quis condimentum enim. Nunc porttitor venenatis feugiat. Etiam quis faucibus erat, non accumsan leo. Aliquam erat volutpat. Vestibulum ac faucibus eros. Cras ullamcorper gravida tellus ut consequat.</p>
                                </div>
                                <a href="/about" className="button w-inline-block">
                                    <div>Learn More</div>
                                </a>
                            </div><img src="../images/placeholder-3.svg" id="w-node-_86e64837-0616-515b-4568-76c147234d3f-8257984c" alt="" />
                        </div>
                        <div className="w-layout-grid about-grid cc-about-2">
                            <div id="w-node-_86e64837-0616-515b-4568-76c147234d41-8257984c">
                                <div className="home-section-wrap">
                                    <div className="label cc-light">Team</div>
                                    <h2 className="section-heading">What we do</h2>
                                    <p className="paragraph-light">Nulla vel sodales tellus, quis condimentum enim. Nunc porttitor venenatis feugiat. Etiam quis faucibus erat, non accumsan leo. Aliquam erat volutpat. Vestibulum ac faucibus eros. Cras ullamcorper gravida tellus ut consequat.</p>
                                </div>
                                <a href="/team" className="button w-inline-block">
                                    <div>Learn More</div>
                                </a>
                            </div><img />
                        </div>
                    </div>
                </div>
            </div>
            <div className="section">
                <div className="container">
                    <div className="blog-heading">
                        <div className="label cc-light">About Us</div>
                        <h2 className="work-heading">Company news</h2>
                    </div>
                    <div className="collection-list-wrapper w-dyn-list">
                        <div role="list" className="collection-wrap w-dyn-items">
                            <div role="listitem" className="blog-preview-wrap w-dyn-item">
                                <a href="#" className="business-article-heading"></a>
                                <div className="label cc-blog-date"></div>
                                <p className="paragraph-light">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.</p>
                            </div>
                        </div>
                        <div className="status-message cc-no-data w-dyn-empty">
                            <div>No items found.</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="section cc-cta">
                <div className="container">
                    <div className="cta-wrap">
                        <div>
                            <div className="cta-text">
                                <div className="heading-jumbo-small">Grow your business.<br /></div>
                                <div className="paragraph-bigger cc-bigger-light">Today is the day to build the business of your dreams. Share your mission with the world — and blow your customers away.<br /></div>
                            </div>
                            <a href="#" className="button cc-jumbo-button w-inline-block">
                                <div>Start Now</div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="section">
                <div className="container">
                    <div className="footer-wrap">
                        <a href="https://webflow.com/" target="_blank" className="webflow-link w-inline-block"><img src="images/webflow-w-small2x_1webflow-w-small2x.png" width="15" alt="" className="webflow-logo-tiny" />
                            <div className="paragraph-tiny">Powered by Webflow</div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
