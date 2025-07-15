import React, { Suspense } from 'react';
import { ClimbingBoxLoader } from 'react-spinners';

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
          <ClimbingBoxLoader
           className='mt-4' color='gray' size={20} />
           </div>
           }
        >
            {children}
        </Suspense>
    </div>
  )
}

export default Layout;