'use client';

import React from 'react';
import { Wallet } from '@coinbase/onchainkit/wallet';
import { Button } from '@/components/ui/button';

interface WalletConnectButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function WalletConnectButton({ className = '', children }: WalletConnectButtonProps) {
  return (
    <Wallet>
      <Button className={className}>
        {children || "Connect Wallet"}
      </Button>
    </Wallet>
  );
}