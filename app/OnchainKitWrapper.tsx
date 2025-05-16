'use client';

import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'viem/chains';
import { ReactNode } from 'react';

interface OnchainKitWrapperProps {
  children: ReactNode;
}

export default function OnchainKitWrapper({ children }: OnchainKitWrapperProps) {
  return (
    <OnchainKitProvider
      chain={base}
      config={{
        appearance: {
          name: 'JobAgent',
        },
      }}
    >
      {children}
    </OnchainKitProvider>
  );
}