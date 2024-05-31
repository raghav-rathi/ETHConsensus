import React, { useState, useEffect } from 'react';
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useSignAndExecuteTransactionBlock, useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariable } from "../../src/networkConfig";
import { NavBar } from "../navBar/navBar";
import { MultiSelect } from "../multiSelect/multiSelect";
import { HorizontalCardScroll } from "../horizontalCardScroll/horizontalCardScroll";
import { SuccessTransitionAlerts } from "../alert/success";
import { FailTransitionAlerts } from "../alert/fail";
import { FileUploader } from "react-drag-drop-files";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";

const fileTypes = ["JPG", "PNG", "GIF"];


const backgroundStyle = {
  width: '100vw',
  height: '100vh',
  display: 'flex', // Use flexbox to center children
  flexDirection: 'column', // Stack children vertically
  alignItems: 'center', // Center children horizontally
  justifyContent: 'center', // Center children vertically
  backgroundColor: "#051329",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: "2rem"
};

// Add this style for the form container
const formContainerStyle = {
  padding: "1rem",
  width: '80vw',
  maxWidth: '500px', // Set a max width if you want to limit how wide the form can go
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem", // Spacing between children
};

export function CreateAsset({ onMinted }) {

  const currentAccount = useCurrentAccount();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');


  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successAlertKey, setSuccessAlertKey] = useState(0);
  const [errorAlertKey, setErrorAlertKey] = useState(0);

  const [file, setFile] = useState(null);

  const [chipData, setChipData] = useState<readonly ChipData[]>([
    { key: 0, label: 'Image' },
  ]);

  const handleFileChange = (file: any) => {
    setFile(file);
  };


  const client = useSuiClient();
  const nftPackageId = useNetworkVariable("counterPackageId");
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();

  const triggerAlert = (successMsg, errorMsg) => {
    if (successMsg) {
      setSuccessMessage(successMsg);
      setSuccessAlertKey(prevKey => prevKey + 1);
    }
    if (errorMsg) {
      setErrorMessage(errorMsg);
      setErrorAlertKey(prevKey => prevKey + 1);
    }
  };

  // const mintNFT = () => {
  //   console.log("minting....")
  //   const txb = new TransactionBlock();

  //   txb.moveCall({
  //     arguments: [
  //       new txb.pure(name),
  //       new txb.pure(description),
  //       new txb.pure(url),
  //     ],
  //     target: `${nftPackageId}::assetdb::mint_to_sender`,
  //   });

  //   signAndExecute({
  //     transactionBlock: txb,
  //     options: {
  //       showEffects: true,
  //       showObjectChanges: true,
  //     },
  //   }, {
  //     onSuccess: (tx) => {
  // console.log("Transaction Success Callback Entered"); // Debug line
  // client.waitForTransactionBlock({ digest: tx.digest }).then(() => {
  //   const objectId = tx.effects?.created?.[0]?.reference?.objectId;
  //   console.log("Transaction Wait Success", tx); // Further debug line
  //   if (objectId) {
  //     onMinted(objectId);
  //     triggerAlert("NFT minted successfully!", "");
  //   }
  // });
  //     },
  //     onError: (error) => {
  //       triggerAlert('', "Failed to mint NFT.");
  //     }
  //   });
  // };

  const mintNFT = async () => {
  console.log("minting....");

  // Transform chipData labels into a comma-separated string
  const chipLabels = chipData.map(chip => chip.label).join(", ");
    
  // Step 1: Forming the FormData to send the image and other data
  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", chipLabels || "none");
  formData.append("created_by", "none");
  formData.append("creative_url", "none");
  formData.append("is_active", "true");
  formData.append("account_id", "none");
  formData.append("nft_id", "none");
  if (file) {
    formData.append("image", file);
  }

  try {
    // Step 2: Sending POST request to your API
    const postResponse = await axios.post('http://localhost:8000/api/nft/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Assuming the response contains the creative_url needed for the transaction
    const { creative_url } = postResponse.data;

    console.log("got creative url")
    console.log(creative_url)

    // Step 3: Using creative_url in the transaction
    const txb = new TransactionBlock();

    txb.moveCall({
      arguments: [
        new txb.pure(name),
        new txb.pure(description),
        new txb.pure(creative_url),
      ],
      target: `${nftPackageId}::assetdb::mint_to_sender`,
    });

    signAndExecute({
      transactionBlock: txb,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    }, {
      onSuccess: async (tx) => {
        await client.waitForTransactionBlock({ digest: tx.digest });
        const objectId = tx.effects?.created?.[0]?.reference?.objectId;
        const addressOwner = tx.effects?.created?.[0]?.owner?.AddressOwner;
       

        if (objectId) {
          

          // Step 4: Updating the NFT details with the transaction information
          // You may want to add more details in this update based on your application's requirements
          await axios.put(`http://localhost:8000/api/nft/${postResponse.data.id}/`, {
            ...postResponse.data, // Re-using the initial data or modify as needed
            nft_id: objectId,
            account_id: addressOwner,
          });

          triggerAlert("NFT minted successfully!", "");
        }
      },
      onError: (error) => {
        console.error("Transaction failed", error);
        triggerAlert('', "Failed to mint NFT.");
      }
    });
  } catch (error) {
    console.error("Failed to post NFT data", error);
    triggerAlert('', "Failed to post NFT data.");
  }
};


  const burnNFT = async ( nftId, rowId ) => {
  
    console.log("Burning NFT ID:", nftId);
    console.log("rowId:", rowId);
    try {
      // Step 1: Delete the record from the database
      await axios.delete(`http://localhost:8000/api/nft/${rowId}/`);
      console.log(`Record with rowId ${rowId} deleted successfully.`);
      
      // Proceed with burning the NFT only if the deletion is successful
      const txb = new TransactionBlock();
      
      txb.moveCall({
        // Ensure the arguments and target are correctly set up for your specific use case
        arguments: [txb.object(nftId)],
        target: `${nftPackageId}::assetdb::burn`,
      });
      
      signAndExecute({
        transactionBlock: txb,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      }, {
        onSuccess: (tx) => {
          console.log("NFT burned successfully:", tx);
          triggerAlert("NFT burned successfully!", "");
      
        },
        onError: (error) => {
          console.error("Failed to burn NFT", error);
          triggerAlert('', "Failed to burn NFT.");
        }
      });
    } catch (error) {
      console.error("Failed to delete record from database", error);
      // Handle the deletion error (e.g., record not found, server error)
      triggerAlert('', `Failed to delete record with rowId ${rowId}.`);
    }
  };

  const [nfts, setNfts] = useState([]); // State to hold fetched NFT data
  
  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/nft/");
        console.log(response.data);
        setNfts(response.data);
      } catch (error) {
        console.error("Failed to fetch NFTs", error);
      }
    };

    fetchNFTs();
  }, []);
  
  const isSuccessAlertOpen = !!successMessage;


  return (

      
        currentAccount ? 
        (
        <>
          <NavBar />
          <div style = { backgroundStyle } >
          

          
          <div style={formContainerStyle}>
            <div>
              <FileUploader handleChange={handleFileChange} name="file" types={fileTypes} />
            </div>
              

              <TextField
                size="small"
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
                placeholder="Name"
                style={{ marginRight: 8, backgroundColor: "white" }}
              />

            <MultiSelect chipData={chipData} setChipData={ setChipData }/>
            

            <Button variant="contained" color="success" onClick={mintNFT}>Mint</Button>
          </div>

          
          <HorizontalCardScroll nfts={nfts} burnNFT={burnNFT}/>

        

          <SuccessTransitionAlerts
            key={`success-${successAlertKey}`}
            message={successMessage}
            open={isSuccessAlertOpen}
            setOpen={() => setSuccessMessage('')}
          />
          
          <FailTransitionAlerts
            key={`error-${errorAlertKey}`}
            message={errorMessage}
            open={!!errorMessage}
            setOpen={() => setErrorMessage('')}
          />
          </div >
      
      </>
      ) : (
        <div style = { backgroundStyle } >
          <NavBar />
          <div style={{width: "100vw", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center"}}>
          <Heading>Connect to wallet.</Heading>
          </div>
          
          
          </div>
          )
      
  );
}
