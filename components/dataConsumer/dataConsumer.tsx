import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGridPro } from '@mui/x-data-grid-pro';
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { NavBar } from "../navBar/navBar";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useSignAndExecuteTransactionBlock, useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariable } from "../../src/networkConfig";
import CallSplitIcon from '@mui/icons-material/CallSplit';


const downloadImage = (url, name) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = name.replace(/\s+/g, '_').toLowerCase() + '.jpg'; // Optional: Format the filename
  document.body.appendChild(link); // Required for Firefox
  link.click();
  document.body.removeChild(link);
};


export function DataConsumer() {
  const currentAccount = useCurrentAccount();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const client = useSuiClient();
  const nftPackageId = useNetworkVariable("counterPackageId");
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();

  const handleShareFractionalNFT = async (rowData) => {
  // Make a POST request to share ownership information
  try {
    await axios.post('http://localhost:8000/api/ownership/', {
      nft_id: rowData.id,
      recipient_id: "0xaf77c343db7c97487c0f04485790d10100e05ee76d5be5c1260b35efb7336967"
    });
    console.log("Ownership data shared successfully.");

    // Proceed to execute the blockchain transaction
    shareFractionalNFT(rowData);
  } catch (error) {
    console.error("Failed to share ownership data:", error);
    alert("Failed to share ownership data.");
  }
};


const shareFractionalNFT = async (rowData) => {
  const txb = new TransactionBlock();
  
  txb.moveCall({
    target: `${nftPackageId}::assetdb::share_ip`,
    arguments: [
       txb.pure("0xaf77c343db7c97487c0f04485790d10100e05ee76d5be5c1260b35efb7336967"),
       txb.pure(rowData.nft_id),
       txb.pure("0.0001"),
       txb.pure(rowData.creative_url),
    ],
  });

  try {
    await signAndExecute({
      transactionBlock: txb,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    });
    console.log("Fractional NFT shared successfully.");
    alert("Fractional NFT shared successfully!");
    downloadImage(rowData.creative_url, rowData.name);
  } catch (error) {
    console.error("Error sharing fractional NFT:", error);
    alert("Failed to share fractional NFT.");
  }


  
};

  // Define columns for DataGridPro
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'description', headerName: 'Media type', width: 200 },
 
    { field: 'is_active', headerName: 'Is Active', width: 130 },
    { field: 'account_id', headerName: 'Owner ID', width: 200 },
    { field: 'nft_id', headerName: 'NFT ID', width: 200 },
    { field: 'created_on', headerName: 'Created On', width: 150 },
    { field: 'modified_on', headerName: 'Modified On', width: 150 },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
        <button
          onClick={() => handleShareFractionalNFT(params.row)}
          style={{ cursor: 'pointer', color: "black", width: "100%" }}
        >
          <CallSplitIcon/> Share
          
        </button>
      ),
    },

  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/api/nft/');
        setRows(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // Main render
  return (
    <>
      {currentAccount ? (
        <div style={{ height: '100%', width: '100%', backgroundColor: "gray"}}>
          <NavBar />
          <DataGridPro
            rows={rows}
            columns={columns}
            loading={loading}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            checkboxSelection
            disableSelectionOnClick
          />
        </div>
      ) : (
        <>
          <NavBar />
          <div style={{ padding: '20px' }}>Please connect to your wallet.</div>
        </>
      )}
    </>
  );
}
