'use client';

import { WalletDiagnostic } from '@/components/WalletDiagnostic';

export default function DiagnosticPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Wallet & Contract Diagnostic</h1>
        <p className="text-muted-foreground text-center mb-8">
          Use this page to test wallet connection and contract integration
        </p>
        <WalletDiagnostic />
      </div>
    </div>
  );
}
