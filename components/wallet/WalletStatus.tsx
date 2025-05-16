'use client';

import React from 'react';
import { useWalletContext } from '@coinbase/onchainkit/wallet';
import { Badge } from '@/components/ui/badge';

export default function WalletStatus() {
  const walletContext = useWalletContext();
  const address = walletContext?.address;
  
  if (!address) {
    return (
      <Badge variant="warning">Connected</Badge>
    );
  }

  return (
    <div className="flex flex-col space-y-1">
      <Badge variant="success">Connected</Badge>
      <span className="text-xs text-gray-500">
        {address.slice(0, 6)}...{address.slice(-4)}
      </span>
    </div>
  );
}