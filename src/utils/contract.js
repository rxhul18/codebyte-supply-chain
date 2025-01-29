import { ethers } from "ethers";
import contractABI from "../config/supplyChain.json"; // Import your ABI file

const contractAddress = "0x892901f9071d13d3f377adc54bd3c5dcd4f7b5a5"; // Replace with your deployed contract address

// Function to get a provider and signer
const getContract = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed!");
  }

  try {
    // Request account access
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Switch to Sepolia network
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }], // Sepolia Chain ID
      });
    } catch (switchError) {
      // Handle chain switch error
      if (switchError.code === 4902) {
        throw new Error("Please add Sepolia network to MetaMask");
      }
      throw new Error("Please switch to Sepolia network");
    }

    // Using updated ethers v6 syntax
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
  } catch (error) {
    throw error;
  }
};

export default getContract;