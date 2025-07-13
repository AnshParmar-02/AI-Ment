import React, { Suspense } from 'react';
import { BounceLoader } from 'react-spinners';

const Layout = ({children}) => {
  return (
    <div className='px-5'>
        <div className='flex items-center justify-between mb-5'>
            <h1 className='text-6xl font-bold gradient-title'>Industry Insights</h1>
        </div>
        <Suspense 
          fallback={
          <div style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
          <BounceLoader
           className='mt-4' color='gray' />
           </div>
           }
        >
            {children}
        </Suspense>
    </div>
  )
}

export default Layout;