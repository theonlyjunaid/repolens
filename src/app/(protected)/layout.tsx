import React from 'react'
import {SidebarProvider} from  "@/components/ui/sidebar"
import { AppSidebar } from './dashboard/app-sidebar'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

type Props = {
    children: React.ReactNode
}



const SideBarLayout = ({children} : Props) => {
  return (
    <SidebarProvider>
        <AppSidebar/>

        <main className='w-full m-2'>
          {/* main content */}
          <div className='border-sidebar-border bg-sidebar border shadow rounded-md overflow-y-scroll h-[calc(100vh-1rem)] p-4 '>
            {children}
          </div>
        </main>
    </SidebarProvider>
  )
}

export default SideBarLayout