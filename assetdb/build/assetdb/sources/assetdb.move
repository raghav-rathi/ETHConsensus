module assetdb::assetdb {
    use sui::url::{Self, Url};
    use std::string;
    use sui::object::{Self, ID, UID};
    use sui::event;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct BaseNFT has key, store {
        id: UID,
        name: string::String,
        description: string::String,
        url: Url,
    }

    struct FractionalNFT has key, store {
        id: UID,
        nft: string::String,
        fraction: string::String,
        url: Url,
    }


    // ===== Events =====

    struct NFTMinted has copy, drop {
        object_id: ID,
        creator: address,
        name: string::String,
    }

    struct FractionalNFTCreated has drop, copy {
        object_id: ID,
        recipient: address,
        fraction: string::String,
    }


    // ===== Public view functions =====

    /// Get the NFT's `name`
    public fun name(nft: &BaseNFT): &string::String {
        &nft.name
    }

    /// Get the NFT's `description`
    public fun description(nft: &BaseNFT): &string::String {
        &nft.description
    }

    /// Get the NFT's `url`
    public fun url(nft: &BaseNFT): &Url {
        &nft.url
    }

    // ===== Entrypoints =====

    /// Create a new devnet_nft
    public fun mint_to_sender(
        name: vector<u8>,
        description: vector<u8>,
        url: vector<u8>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let nft = BaseNFT {
            id: object::new(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            url: url::new_unsafe_from_bytes(url)
        };

        event::emit(NFTMinted {
            object_id: object::id(&nft),
            creator: sender,
            name: nft.name,
        });

        transfer::public_transfer(nft, sender);
    }

    /// Transfer `nft` to `recipient`
    public fun transfer(
        nft: BaseNFT, recipient: address, _: &mut TxContext
    ) {
        transfer::public_transfer(nft, recipient)
    }

    /// Update the `description` of `nft` to `new_description`
    public fun update_description(
        nft: &mut BaseNFT,
        new_description: vector<u8>,
        _: &mut TxContext
    ) {
        nft.description = string::utf8(new_description)
    }

    /// Permanently delete `nft`
    public fun burn(nft: BaseNFT, _: &mut TxContext) {
        let BaseNFT { id, name: _, description: _, url: _ } = nft;
        object::delete(id)
    }

    public fun share_ip(
        recipient: address,
        nft: vector<u8>,
        fraction: vector<u8>,
        url: vector<u8>,
        ctx: &mut TxContext
    ) {
        
        let sender = tx_context::sender(ctx);
        let fractional_nft = FractionalNFT {
            id: object::new(ctx),
            nft: string::utf8(nft),
            fraction: string::utf8(fraction),
            url: url::new_unsafe_from_bytes(url)
        };

        event::emit(FractionalNFTCreated {
            object_id: object::id(&fractional_nft),
            recipient: recipient,
            fraction: fractional_nft.fraction,
        });
        
        transfer::public_transfer(fractional_nft, recipient);

    }


}
