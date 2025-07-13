import React, { Suspense } from 'react';
import { BounceLoader } from 'react-spinners';

const Layout = ({children}) => {
  return (
    <div className='px-5'>
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

export default Layout