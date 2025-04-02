import { useState, useEffect } from "react";
import { ethers, BrowserProvider, Contract } from "ethers";
import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import FileUpload from "./components/custom/FileUpload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Type declaration for `window.ethereum` to resolve TypeScript error
declare global {
  interface Window {
    ethereum?: any; // Optional in case MetaMask is not installed
  }
}

function App() {
  // Store the connected account address
  const [account, setAccount] = useState<string>("");

  // Store the contract instance
  const [contract, setContract] = useState<Contract | null>(null);

  // Store the provider (MetaMask)
  const [provider, setProvider] = useState<BrowserProvider | null>(null);

  // State to track connection status
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask to use this application");
      }

      // Initialize Ethers provider using MetaMask
      const provider = new BrowserProvider(window.ethereum);

      // Request account access from MetaMask
      await provider.send("eth_requestAccounts", []);

      // Get the signer (account interacting with the contract)
      const signer = await provider.getSigner();

      // Get and store the connected account address
      const address = await signer.getAddress();
      setAccount(address);

      const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

      // Load contract with ABI and signer
      const contract = new ethers.Contract(contractAddress, Upload.abi, signer);

      // Store contract and provider in state
      setContract(contract);
      setProvider(provider);

      // Setup account change listener
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setError(
        error instanceof Error ? error.message : "Failed to connect wallet"
      );
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            GDrive 3.0
          </CardTitle>
          <CardDescription>
            Decentralized file storage on the blockchain
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center justify-center w-full mb-4">
              <Badge
                variant={account ? "default" : "destructive"}
                className="px-4 py-2 text-sm"
              >
                {account ? "Connected" : "Not Connected"}
              </Badge>
            </div>

            {account ? (
              <div className="text-center mb-6">
                <p className="text-sm text-slate-500">Connected Account</p>
                <p className="font-mono bg-slate-100 rounded-md px-3 py-1 text-sm">
                  {formatAddress(account)}
                </p>
              </div>
            ) : (
              <Button
                onClick={connectWallet}
                disabled={isConnecting}
                className="w-full max-w-xs"
              >
                {isConnecting ? "Connecting..." : "Connect MetaMask"}
              </Button>
            )}

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            {account && contract && (
              <div className="w-full mt-4">
                <FileUpload
                  contract={contract}
                  account={account}
                  provider={provider}
                />
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-center border-t pt-4">
          <p className="text-xs text-slate-500">
            Using Ethereum Smart Contracts for decentralized storage
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;
