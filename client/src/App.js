import './App.css';
import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import {useState, useEffect} from "react";
import { ethers } from 'ethers';
import FileUpload from './components/FileUpload';
import Display from './components/Display';
import Modal from "./components/Modal";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);


  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const loadProvider = async () =>{
      if(provider){
        window.ethereum.on("ChainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });

        await provider.send("eth_requestAccounts",[]);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3" //in this contract private key if you restart your terminal or anything else then you need to deploy this once more and that create a one more new pvt key copy this thing and pasted this into this line. also this is the command line we need to run this into the terminal " npx hardhat run --network localhost scripts/deploy.js"
        const contract = new ethers.Contract(
          contractAddress, Upload.abi, signer
        );
        console.log(contract);
        setContract(contract);
        setProvider(provider);
      }else{
        console.error("MetaMask is not available.");
      }
    };
    provider && loadProvider()
  }, []);


  return (
    <div className="App">
      <h1>SnapNode</h1>
      <div class="bg"></div>

      <p>Account : {account ? account: "MetaMask Not Connected"}</p>

      <FileUpload 
      account = {account}
      provider = {provider}
      contract = {contract}
      ></FileUpload>
    </div>
  );
}

export default App;
