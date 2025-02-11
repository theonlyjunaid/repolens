import Link from "next/link"
import { Github, FileText, MessageSquare, GitCommit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoginLink, LogoutLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components"

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
const { getUser, isAuthenticated } = getKindeServerSession();

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <Github className="h-6 w-6 mr-2" />
          <span className="font-bold">Repo Lens</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
        {  (await isAuthenticated()) ? <div> 
          <div className="text-sm font-medium hover:underline underline-offset-4" >
          <LogoutLink>Log out</LogoutLink>
          </div>
        </div>  
        :
         <div>
           <div className="text-sm font-medium hover:underline underline-offset-4" >
         <LoginLink postLoginRedirectURL="https://repolens.vercel.app/sync-user-to-db">Sign In</LoginLink>
          </div>

          <div className="text-sm font-medium hover:underline underline-offset-4" >
            
         <RegisterLink postLoginRedirectURL="https://repolens.vercel.app/sync-user-to-db">Sign Up</RegisterLink>
          </div>

          </div>}
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Unlock the Power of Your GitHub Repos
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Analyze, question, and understand your repositories like never before with Repo Lens.
                </p>
              </div>
              <div className="space-x-4">
              { (await isAuthenticated()) ?
              <div>
              <Button>
         <Link href={"/dashboard"} >Dashboard</Link>
                </Button>
              </div> 
            : 
            <div>
                <Button>
         <RegisterLink postLoginRedirectURL="https://repolens.vercel.app/sync-user-to-db">Sign up to Get Started.</RegisterLink>
                </Button>

              </div>}

             
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Key Features</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Github className="h-12 w-12 mb-2" />
                <h3 className="text-xl font-bold">Repo Analysis</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Deep dive into any GitHub repository with just a link.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <MessageSquare className="h-12 w-12 mb-2" />
                <h3 className="text-xl font-bold">Ask Questions</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Get answers about the repo&rsquo;s structure, code, and more.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <FileText className="h-12 w-12 mb-2" />
                <h3 className="text-xl font-bold">README Generator</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Automatically generate comprehensive README files.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <GitCommit className="h-12 w-12 mb-2" />
                <h3 className="text-xl font-bold">Commit Insights</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Get brief info about the latest commits in the repository.
                </p>
              </div>
            </div>
          </div>
        </section>
        
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          <a href="https://linkedin.com/in/talha-ansarii" target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">
          Made by: Talha Ansari 
          </a>
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a className="text-xs hover:underline underline-offset-4" href="https://github.com/talha-ansarii" target="_blank" rel="noopener noreferrer">
            Github
          </a>
          
        </nav>
      </footer>
    </div>
  )
}

