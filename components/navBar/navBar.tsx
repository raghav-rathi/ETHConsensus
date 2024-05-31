import { ConnectButton } from "@mysten/dapp-kit";
import { Box, Flex, Heading } from "@radix-ui/themes";

export function NavBar() {
    return (
        <>
            <Flex
                position="sticky"
                px="4"
                py="2"
                justify="between"
                style={{
                borderBottom: "1px solid var(--gray-a2)",
                alignItems: 'center', // Ensures logo and button are aligned
                width: '100%', // Ensure the navbar spans the full width
                backgroundColor: "#210433", // Set background color
            }}
            >
                <Box>
                    {/* Replace src with the path to your logo image */}
                    <img src="https://sui-nft-assets.s3.us-east-2.amazonaws.com/full-logo-3.png" alt="Logo" style={{ height: '55px' }} />
                </Box>

                <Box>
                    <ConnectButton />
                </Box>
            </Flex>
        </>
    )
}



