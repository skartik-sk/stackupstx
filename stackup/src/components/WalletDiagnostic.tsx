'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/contexts/WalletContextNew';
import { createSimpleBounty, createMockBounty } from '@/services/simpleBountyContract';
import { toast } from 'react-hot-toast';

export function WalletDiagnostic() {
  const { isConnected, userAddress, connectWallet, userData } = useWallet();
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const addResult = (test: string, success: boolean, details: any) => {
    setResults(prev => [...prev, { test, success, details, timestamp: new Date() }]);
  };

  const testWalletConnection = async () => {
    addResult('Wallet Connection', isConnected, { userAddress, hasUserData: !!userData });
  };

  const testSimpleContract = async () => {
    if (!userAddress) {
      addResult('Simple Contract', false, { error: 'No wallet address' });
      return;
    }

    try {
      setTesting(true);
      const result = await createSimpleBounty({
        title: 'Test Bounty',
        description: 'This is a test bounty to check contract integration',
        rewardAmount: 1000000, // 1 STX in microSTX
      }, userAddress);

      addResult('Simple Contract', result.success, result);
      
      if (result.success) {
        toast.success('Simple contract test successful!');
      } else {
        toast.error(`Simple contract test failed: ${result.error}`);
      }
    } catch (error) {
      addResult('Simple Contract', false, { error: error instanceof Error ? error.message : 'Unknown error' });
      toast.error('Simple contract test failed');
    } finally {
      setTesting(false);
    }
  };

  const testMockContract = async () => {
    if (!userAddress) {
      addResult('Mock Contract', false, { error: 'No wallet address' });
      return;
    }

    try {
      setTesting(true);
      const result = await createMockBounty({
        title: 'Test Mock Bounty',
        description: 'This is a mock test',
        rewardAmount: 1000000,
      }, userAddress);

      addResult('Mock Contract', result.success, result);
      toast.success('Mock contract test completed!');
    } catch (error) {
      addResult('Mock Contract', false, { error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setTesting(false);
    }
  };

  const clearResults = () => setResults([]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>🔧 Wallet & Contract Diagnostic</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Wallet Status */}
        <div className="flex items-center justify-between p-3 border rounded">
          <div>
            <span className="font-medium">Wallet Status: </span>
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>
          {!isConnected && (
            <Button onClick={connectWallet} size="sm">
              Connect Wallet
            </Button>
          )}
        </div>

        {/* User Address */}
        {userAddress && (
          <div className="p-3 border rounded bg-muted/50">
            <span className="font-medium">Address: </span>
            <code className="text-sm">{userAddress}</code>
          </div>
        )}

        {/* Test Buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button onClick={testWalletConnection} variant="outline" size="sm">
            Test Wallet
          </Button>
          <Button 
            onClick={testSimpleContract} 
            variant="outline" 
            size="sm"
            disabled={!isConnected || testing}
          >
            {testing ? 'Testing...' : 'Test Simple Contract'}
          </Button>
          <Button 
            onClick={testMockContract} 
            variant="outline" 
            size="sm"
            disabled={!isConnected || testing}
          >
            Test Mock Contract
          </Button>
          <Button onClick={clearResults} variant="ghost" size="sm">
            Clear Results
          </Button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Test Results:</h4>
            {results.map((result, index) => (
              <div key={index} className="p-3 border rounded text-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{result.test}</span>
                  <Badge variant={result.success ? "default" : "destructive"}>
                    {result.success ? 'Pass' : 'Fail'}
                  </Badge>
                </div>
                <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                  {JSON.stringify(result.details, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        )}

        {/* Instructions */}
        <div className="p-3 border rounded bg-blue-50 text-sm">
          <h4 className="font-medium mb-2">🔍 Troubleshooting Guide:</h4>
          <ul className="space-y-1 text-muted-foreground">
            <li>• If wallet connection fails, try refreshing and reconnecting</li>
            <li>• If simple contract fails, check Leather wallet console for errors</li>
            <li>• Mock contract should always work for testing UI flow</li>
            <li>• Check browser console for detailed error messages</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
