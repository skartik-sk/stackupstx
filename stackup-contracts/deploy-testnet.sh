#!/bin/bash

# StackUp Contracts Testnet Deployment Script
echo "🚀 Starting StackUp Contracts Testnet Deployment..."

# Check if we're in the correct directory
if [ ! -f "Clarinet.toml" ]; then
    echo "❌ Error: Clarinet.toml not found. Please run this script from the stackup-contracts directory."
    exit 1
fi

# Compile contracts first
echo "📋 Checking contracts..."
clarinet check
if [ $? -ne 0 ]; then
    echo "❌ Contract compilation failed. Please fix errors and try again."
    exit 1
fi

echo "✅ Contracts compiled successfully!"

# Deploy to testnet
echo "🌐 Deploying contracts to Stacks Testnet..."
echo "📝 Note: Make sure you have STX in your deployer wallet for transaction fees"
echo "🔑 Deployer address from mnemonic will be used"

# Deploy using clarinet publish
clarinet publish --testnet

if [ $? -eq 0 ]; then
    echo "🎉 Deployment successful!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Update CONTRACT_ADDRESS in your frontend environment"
    echo "2. Test contract interactions in the frontend"
    echo "3. Verify contracts on Stacks Explorer"
    echo ""
    echo "🔍 Check deployment status at: https://explorer.stacks.co/txs?chain=testnet"
else
    echo "❌ Deployment failed. Check error messages above."
    exit 1
fi
