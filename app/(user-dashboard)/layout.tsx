import Navbar from "@/components/navbar";


export default function UserDashboardLayout(
    { children }: Readonly<{ children: React.ReactNode }>
) {
    return (
        <>
            <Navbar />
            {children}
        </>
    )
}
