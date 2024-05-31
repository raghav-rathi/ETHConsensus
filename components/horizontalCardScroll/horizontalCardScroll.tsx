import React, { useState } from 'react';
import { render } from "react-dom";
import { animated, useSpring } from "react-spring";
import { useScroll } from "react-use-gesture";
import "./styles.css";

const movies = [
  "https://sui-nft-assets.s3.amazonaws.com/raw_sketch/NFT_123.jpg",
  "https://goinswriter.com/wp-content/uploads/2013/10/breaking-bad.png",
  "https://churchlifejournal.nd.edu/assets/515222/1200x/1900px_ozymandias_breaking_bad.jpg",
  "https://goinswriter.com/wp-content/uploads/2013/10/breaking-bad.png",
  "https://churchlifejournal.nd.edu/assets/515222/1200x/1900px_ozymandias_breaking_bad.jpg",
  "https://goinswriter.com/wp-content/uploads/2013/10/breaking-bad.png",
];

const clamp = (value: number, clampAt: number = 30) => {
  if (value > 0) {
    return value > clampAt ? clampAt : value;
  } else {
    return value < -clampAt ? -clampAt : value;
  }
};

export function HorizontalCardScroll ({nfts, burnNFT}) {
  const [style, set] = useSpring(() => ({
    transform: "perspective(500px) rotateY(0deg)"
  }));

  const bind = useScroll(event => {
    set({
      transform: `perspective(500px) rotateY(${
        event.scrolling ? clamp(event.delta[0]) : 0
      }deg)`
    });
  });

  // Example function to be called
  const handleClick = (nftId) => {
    console.log(`NFT ID: ${nftId}`);
  };

  return (
    <>
      <div className="container" {...bind()}>
        {nfts.map((nft, index) => (
          <animated.div
            key={index}
            className="card"
            style={{
              ...style,
              backgroundImage: `url(${nft.creative_url})`
            }}
          >
            <div className="card-content">
              <h3>{nft.name}</h3>
              <p>Description: {nft.description}</p>
              <p>Created by: {nft.created_by}</p>
              <p>Account ID: {nft.account_id}</p>
              <p>NFT ID: {nft.nft_id}</p>
              <p>Created on: {new Date(nft.created_on).toLocaleDateString()}</p>
              {/* Adding a button that calls handleClick when clicked */}
              
              <button onClick={() => burnNFT(nft.nft_id, nft.id)}>🔥</button>
            </div>
          </animated.div>
        ))}
      </div>
    </>
  );
};
