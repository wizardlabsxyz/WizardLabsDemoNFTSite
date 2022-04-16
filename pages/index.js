import Header from '@components/Header'
import { ethers } from "ethers";
import { useState } from 'react';
import Button from '@mui/material/Button';


export default function Home() {

    const [val, setVal] = useState(undefined);

    main().then((data) => {
        console.log(data.toString());
        setVal(data.toString());
    })

    async function main() {
        var url = 'https://eth-rinkeby.alchemyapi.io/v2/Bk4gFDQ7onQkwQ8EhCQh7FRZIFySm0Vv';
        const provider = new ethers.providers.JsonRpcProvider(url);
        const balance = await provider.getBalance("0x9DAfB9860FcD9A1E1dc00b4660E65cEcDd88E4bB")

        return balance;
    }


    return (
        <div className="container">
            <main>
                <Header title="Welcome to WizardLabsDemoNFT" />
                <Button variant="contained">Mint</Button>
            </main>
        </div>
    );
}
