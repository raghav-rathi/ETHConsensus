import React, { useState } from 'react';
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useSignAndExecuteTransactionBlock } from "@mysten/dapp-kit";
import { useNetworkVariable } from "../../src/networkConfig";

export function ShareFractionalNFT({ onShared }) {
  const [originalNftId, setOriginalNftId] = useState('');
  const [recipient, setRecipient] = useState('');
  const [fraction, setFraction] = useState('');

  const nftPackageId = useNetworkVariable("counterPackageId");
  const { mutate: signAndExecute } = useSignAndExecuteTransactionBlock();

  const shareFractionalNFT = () => {
    const txb = new TransactionBlock();

    txb.moveCall({
      target: `${nftPackageId}::assetdb::share_ip`,
      arguments: [
         txb.pure(recipient),
         txb.pure(originalNftId),
         txb.pure(fraction),
         txb.pure("https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ5mGxS_9qt5c1bqLtXfcAqcmqJXZjsnt9cyI8atrxLfFFf4eVY"),
      ],
    });

    signAndExecute({
      transactionBlock: txb,
      options: {
        showEffects: true,
        showObjectChanges: true,
      },
    }, {
      onSuccess: (tx) => {
        console.log("Fractional NFT shared successfully:", tx);
        alert("Fractional NFT shared successfully!");
        if (onShared) onShared();
      },
      onError: (error) => {
        console.error("Error sharing fractional NFT:", error);
        alert("Failed to share fractional NFT.");
      }
    });
  };

  return (
    <div>
      <input
        type="text"
        value={originalNftId}
        onChange={(e) => setOriginalNftId(e.target.value)}
        placeholder="Original NFT ID"
      />
      <input
        type="text"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        placeholder="Recipient Address"
      />
      <input
        type="number"
        value={fraction}
        onChange={(e) => setFraction(e.target.value)}
        placeholder="Fraction (as a percentage)"
      />
      <button onClick={shareFractionalNFT}>Share Fractional NFT</button>
    </div>
  );
}
