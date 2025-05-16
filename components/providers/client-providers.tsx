'use client';

import React, { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { baseSepolia } from 'viem/chains';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';

interface ClientProvidersProps {
  children: ReactNode;
  session: Session | null;
}

export default function ClientProviders({ children, session }: ClientProvidersProps) {
  return (
    <SessionProvider session={session}>
      <OnchainKitProvider
        chain={baseSepolia}
        config={{
          appearance: {
            name: 'Job Agent',
             // Replace with your actual logo path
          },
        }}
      >
        {children}
      </OnchainKitProvider>
    </SessionProvider>
  );
}