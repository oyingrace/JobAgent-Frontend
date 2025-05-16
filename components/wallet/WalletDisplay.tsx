'use client';

import React from 'react';
import { useWalletContext, Wallet } from '@coinbase/onchainkit/wallet';
import { Button } from '@/components/ui/button';

export default function WalletDisplay() {
  const walletContext = useWalletContext();
  const address = walletContext?.address;
  
  if (!address) {
    return (
      <Wallet />
    );
  }
  
  return (
    <div className="flex items-center space-x-2">
      <div className="text-xs bg-gray-100 px-2 py-1 rounded">
        {address.slice(0, 6)}...{address.slice(-4)}
      </div>
    </div>
  );
}