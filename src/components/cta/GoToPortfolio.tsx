'use client'

import { useRouter } from 'next/navigation';
import { useAuth } from '@campnetwork/origin/react';
import { useCallback, memo, useEffect, useState } from 'react';

const GoToPortfolio = () => {
  const router = useRouter();
  const auth = useAuth();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handlePortfolioRedirect = useCallback(() => {
    if (auth.walletAddress) {
      router.push(`/portfolio/${auth.walletAddress}`);
    }
  }, [auth.walletAddress, router]);

  // Prevent hydration mismatch: only render after mount
  if (!hasMounted || !auth.isAuthenticated || !auth.walletAddress) {
    return null;
  }

  return (
    <div 
      className='w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-red-400 cursor-pointer hover:scale-105 transition-transform duration-200 flex items-center justify-center' 
      onClick={handlePortfolioRedirect}
      title="Go to Portfolio"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handlePortfolioRedirect();
        }
      }}
    />
  );
};

export default memo(GoToPortfolio);
