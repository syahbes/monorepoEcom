"use client"
 import { useAuth } from "@clerk/nextjs"

 const Page = () => {
    const { signOut } = useAuth()
    
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">Unauthorized</h1>
            <h2 className="text-lg">You do not have access to this page</h2>
            <button onClick={() => signOut()} className="mt-4 bg-red-700 text-white px-4 py-2 rounded cursor-pointer">Sign out</button>
        </div>
    )
}
export default Page
