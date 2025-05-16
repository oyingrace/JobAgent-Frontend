'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { Button } from '@/components/ui/button'; // Optional: Tailwind-styled

// Your recipient wallet address
const PAYMENT_ADDRESS = '0xF41CD2b4e459c72b1484469fd4aA8777512A248D';

// Base Sepolia config
const BASE_SEPOLIA_PARAMS = {
  chainId: '0x14AFC', // 84532 in hex
  chainName: 'Base Sepolia',
  nativeCurrency: {
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: ['https://sepolia.base.org'],
  blockExplorerUrls: ['https://sepolia-explorer.base.org']
};

export default function WalletPayment() {
  const [address, setAddress] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('Wallet not found. Install MetaMask or Coinbase Wallet.');
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      setAddress(accounts[0]);
      await switchToBaseSepolia();
    } catch (err: any) {
      setError(err.message || 'Wallet connection failed');
    }
  };

  const switchToBaseSepolia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_SEPOLIA_PARAMS.chainId }]
      });
    } catch (switchError: any) {
      // If the chain is not added yet
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [BASE_SEPOLIA_PARAMS]
          });
        } catch (addError: any) {
          setError('Failed to add Base Sepolia network');
        }
      } else {
        setError('Failed to switch to Base Sepolia');
      }
    }
  };

  const sendPayment = async () => {
    if (!address || typeof window.ethereum === 'undefined') return;

    setIsProcessing(true);
    setError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const tx = await signer.sendTransaction({
        to: PAYMENT_ADDRESS,
        value: ethers.parseEther('0.0001'), // amount to send
      });

      console.log('Transaction hash:', tx.hash);
      await tx.wait();
      alert('Payment successful!');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-start">
      {!address ? (
        <Button onClick={connectWallet}>Upgrade to Pro</Button>
      ) : (
        <>
          {/* <p className="text-sm text-gray-500">Connected: {address}</p> */}
          <Button onClick={sendPayment} disabled={isProcessing}>
            {isProcessing ? 'Sending...' : 'Pay 0.0001 ETH'}
          </Button>
        </>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
