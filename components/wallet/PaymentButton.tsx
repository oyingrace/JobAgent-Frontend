'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';

const PAYMENT_ADDRESS = process.env.NEXT_PUBLIC_PAYMENT_ADDRESS || '';

interface PaymentButtonProps {
  onSuccess?: () => void;
}

export default function PaymentButton({ onSuccess }: PaymentButtonProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [networkWarning, setNetworkWarning] = useState<boolean>(false);
  const [currentChainId, setCurrentChainId] = useState<string | null>(null);

  // Check network on component mount and when address changes
  useEffect(() => {
    if (address && window.ethereum) {
      checkNetwork();
      
      // Set up event listener for network changes
      const handleChainChanged = () => {
        checkNetwork();
      };
      
      window.ethereum.on('chainChanged', handleChainChanged);
      
      // Clean up
      return () => {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [address]);

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
    } catch (err: any) {
      setError(err.message || 'Wallet connection failed');
    }
  };

  const checkNetwork = async () => {
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      setCurrentChainId(chainId);
      
      // Base Sepolia chainId
      setNetworkWarning(chainId !== '0x14AFC');
    } catch (error) {
      console.error('Error checking network:', error);
      // Don't block the payment if we can't check the network
      setNetworkWarning(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setError(null);
    setNetworkWarning(false);
    setCurrentChainId(null);
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
      
      // Wait for transaction to be mined
      await tx.wait();
      
      // Call the API to update the subscription
      const response = await fetch('/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionHash: tx.hash,
          transactionComplete: true
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update subscription');
      }
      
      // Notify parent component of success
      if (onSuccess) {
        onSuccess();
      }
      
      /* alert('Payment successful! You are now a Pro member.'); */
    } catch (err: any) {
      console.error('Error upgrading subscription:', err);
      setError(err.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {!address ? (
        <Button onClick={connectWallet}>Upgrade to Pro</Button>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm bg-gray-100 px-2 py-1 rounded truncate max-w-xs">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={disconnectWallet}
            >
              Disconnect
            </Button>
          </div>
          
          {networkWarning && (
            <Alert type="warning">
              <p className="font-medium">Network Warning</p>
              <p className="text-sm">
                Your wallet is on chain ID: {currentChainId}. Base Sepolia network is recommended (Chain ID: 0x14AFC).
              </p>
              <p className="text-sm mt-1">
                You can continue if you're sure you're on the correct network.
              </p>
            </Alert>
          )}
          
          <Button 
            onClick={sendPayment} 
            disabled={isProcessing} 
            className="w-full"
          >
            {isProcessing ? 'Processing...' : 'Pay 0.0001 ETH'}
          </Button>
        </div>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}