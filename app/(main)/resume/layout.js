import React, { Suspense } from 'react';
import { ClimbingBoxLoader } from 'react-spinners';

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