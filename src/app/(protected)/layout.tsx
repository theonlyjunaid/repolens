import React from 'react'
import {SidebarProvider} from  "@/components/ui/sidebar"
import { AppSidebar } from './dashboard/app-sidebar'
type Props = {
    children: React.ReactNode
}

const SideBarLayout = ({children} : Props) => {
  return (
    <SidebarProvider>
        <AppSidebar/>

        <main className='w-full m-2'>
          <div className='flex items-center gap-2 border-sidebar-border bg-sidebar border shadow rounded-md p-2 px-2'>
            {/* <SearchBar/>  */}
            <div className='ml-auto'></div>
            <div className='w-16 h-16 bg-gray-300 rounded-full'></div>
          </div>
          <div className='h-4'></div>
          {/* main content */}
          <div className='border-sidebar-border bg-sidebar border shadow rounded-md overflow-y-scroll h-[calc(100vh-6rem)] p-4 '>
            {children}
          </div>
        </main>
    </SidebarProvider>
  )
}

export default SideBarLayout