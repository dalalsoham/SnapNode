import { useState } from "react";
import axios from "axios";
import "./FileUpload.css";


const FileUpload = ({contract, account, provider}) =>{

    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("No image selected.");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (file) {
            try {
                // Check if environment variables are loaded
                console.log('API Key:', process.env.PINATA_API_KEY);
                console.log('Secret Key:', process.env.PINATA_SECRET_API_KEY);
    
                const formData = new FormData();
                formData.append("file", file);
    
                const resFile = await axios({
                    method: "post",
                    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                    data: formData,
                    headers: {
                        pinata_api_key: process.env.PINATA_API_KEY,
                        pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
                        "Content-Type": "multipart/form-data",
                    },
                });
    
                const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
                contract.add(account, ImgHash);
                alert("Successfully image uploaded.");
                setFileName("No image selected");
                setFile(null);
            } catch (e) {
                console.error(e);
                alert("Unable to upload Image to Pinata");
            }
        }
    };
    

    const retrieveFile=(e)=>{
        const data = e.target.files[0];
        console.log(data);
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(data);
        reader.onload = ()=>{
            setFile(e.target.files[0]);
        }
        setFileName(e.target.files[0].name);
        e.preventDefault();
    };

    return <div className="top">
        <form className="form" onSubmit={handleSubmit}>
            <label htmlFor="file-upload" className="choose">
                Choose Image
            </label>
            <input 
                disabled={!account}
                type="file"
                id="file-upload"
                name="data"
                onChange={retrieveFile}
            />
            <span className="textArea">Image: {fileName}</span>
            <button type="submit" className="upload">Upload File</button>
        </form>
    </div>
};

export default FileUpload;