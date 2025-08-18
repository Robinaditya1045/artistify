'use client';

import Link from 'next/link';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import OwnerTokenCard from '../cards/OwnerTokenCard';
import { useAuth } from '@campnetwork/origin/react';
import { getUserTokens } from '@/lib/actions/token.actions';

const TokenSection = ({ accountAddress }: { accountAddress: string }) => {
  const auth = useAuth();
  const [activeTab, setActiveTab] = useState('Minted Tokens');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // interface UserData {
  //   accountAddress: string;
  //   mintedTokens: {
  //     id: string;
  //     tokenThumbail: string;
  //     tokenName: string;
  //     availableToken: number;
  //     tokenPrice: number;
  //     isReleased: boolean;
  //     tokenId: string;
  //   }[];
  // }

  const [userData, setUserData] = useState<any[]>([]);

  const fetchUserData = useCallback(async () => {
    if (!auth.isAuthenticated || !auth.walletAddress) {
      setUserData([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await getUserTokens(accountAddress);
      console.log('User tokens:', response)

      setUserData(response);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  }, [auth.isAuthenticated, auth.walletAddress]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const memoizedTokens = useMemo(() => 
    userData.map((token) => (
      <OwnerTokenCard
        key={token.mintedToken.id}
        imageUrl={`https://emerald-managerial-firefly-535.mypinata.cloud/ipfs/${token.mintedToken.tokenThumbail}`}
        tokenName={token.mintedToken.tokenName}
        availableToken={token.mintedToken.availableToken}
        tokenPrice={token.mintedToken.tokenPrice}
        isReleased={token.mintedToken.isReleased}
        tokenId={Number(token.mintedToken.tokenId)}
      />
    )) || [], [userData]
  );

  const renderContent = () => {
    if (!auth.isAuthenticated) {
      return (
        <div className='w-full flex justify-center pt-44'>
          <p className='text-gray-500 text-lg'>Please connect your wallet to view your tokens</p>
        </div>
      );
    }

    if (loading) {
      return (
        <div className='w-full flex justify-center pt-44'>
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <p className='text-gray-500 text-lg'>Loading your tokens...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className='w-full flex justify-center pt-44'>
          <div className="flex flex-col items-center space-y-4">
            <p className='text-red-400 text-lg'>Error: {error}</p>
            <button 
              onClick={fetchUserData}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'Items':
        return (
          <div className='w-full flex justify-center pt-44'>
            <p className='text-gray-500 text-lg'>No Items Available</p>
          </div>
        );
      case 'Minted Tokens':
        return (
          <div className='w-full mt-6'>
            {userData && userData.length > 0 ? (
              <>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
                  {memoizedTokens}
                </div>
                <Link href={`/mint?address=${accountAddress}`}>
                  <button className='bg-orange-500 text-white px-4 py-2 rounded-xl mt-4 hover:bg-orange-600 transition-colors'>
                    Mint Token
                  </button>
                </Link>
              </>
            ) : (
              <div className='w-full flex flex-col items-center justify-center pt-20'>
                <p className='text-gray-500 text-lg mb-4'>No minted tokens yet</p>
                <Link href={`/mint?address=${accountAddress}`}>
                  <button className='bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors'>
                    Mint Your First Token
                  </button>
                </Link>
              </div>
            )}
          </div>
        );
      case 'Holdings':
        return (
          <div className='w-full flex justify-center pt-44'>
            <p className='text-gray-500 text-lg'>No Holdings Available</p>
          </div>
        );
      case 'Activity':
        return (
          <div className='w-full flex justify-center pt-44'>
            <p className='text-gray-500 text-lg'>No Recent Activity</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className='max-w-7xl mx-auto px-4 py-6 min-h-screen bg-[#0a0a0a]'>
      <div className='flex items-center gap-12'>
        {['Items', 'Minted Tokens', 'Holdings', 'Activity'].map(tab => (
          <p
            key={tab}
            className={`cursor-pointer pb-2 transition-colors ${activeTab === tab ? 'text-orange-500 border-b-2 border-orange-500' : 'text-white hover:text-orange-400'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </p>
        ))}
      </div>
      <div className='mt-4 p-4 border-t border-gray-700'>
        {renderContent()}
      </div>
    </div>
  );
}

export default TokenSection;
