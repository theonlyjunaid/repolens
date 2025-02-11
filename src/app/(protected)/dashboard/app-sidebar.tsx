"use client"
import { Button } from "@/components/ui/button"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import useProject from "@/hooks/use-project"
import { cn } from "@/lib/utils"
import { Bot, CreditCard, Github, LayoutDashboard, Plus, Presentation } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"


const items = [
    {
        title : 'Dashboard',
        url : '/dashboard',
        icon : LayoutDashboard
    },
    {
        title : 'Q&A',
        url : '/qa',
        icon : Bot
    },

]




export function AppSidebar(){
     const pathname = usePathname()
     const {open} = useSidebar()

     const {projects, selectedProjectId, setSelectedProjectId} = useProject()
    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader className="flex flex-row justify-start items-center" >
                <Link className="flex gap-2" href={"/"}>
                <span className=" ">
                <Github className="h-6 w-6 mr-2" />
                </span>
               {open &&
                <span className="text-xl w-[80%]   font-bold">
                    REPO LENS
                </span>}

                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                      {
                            items.map(item =>{
                                return (
                                <SidebarMenuItem className="hover:bg-black/10 rounded-md" key={item.title} >
                                    <SidebarMenuButton asChild >
                                        <Link href={item.url} className={cn({
                                            '!bg-primary !text-white' : pathname === item.url
                                        })}>
                                            <item.icon size={24} />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )})
                        }
                       
                      </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>
                        Projects
                    </SidebarGroupLabel>
                     <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                projects?.map((project) => {
                                    return (
                                        <SidebarMenuItem className="hover:bg-black/10 rounded-md cursor-pointer" key={project.name}>
                                            <SidebarMenuButton asChild>
                                                <div onClick={() => setSelectedProjectId?.(project.id)}>
                                                    <div className={cn("rounded-sm border size-6 flex items-center justify-center text-sm bg-white text-primary ",
                                                        {
                                                            "bg-primary text-white " : project?.id === selectedProjectId
                                                        }
                                                    )}>
                                                        {project?.name[0]}
                                                    </div>
                                                    <span className="text-sm truncate">{project.name}</span>
                                                </div>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    )
                                })
                            }
                        <div className="h-2"></div>

                             {open&&
                                <SidebarMenuItem>
                                <Link href={"/create"}>
                        <Button size={"sm"} variant={"outline"} className="w-fit">
                            <Plus />
                            Create Project
                        </Button>
                                </Link>
                        </SidebarMenuItem>}
                        </SidebarMenu>
                        </SidebarGroupContent>   
                </SidebarGroup>

            </SidebarContent>
        </Sidebar>
    )
}