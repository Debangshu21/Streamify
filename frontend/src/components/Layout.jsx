import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children, showSidebar = false }) => {
    return (
        <div className="min-h-screen">
            <div className="flex">
                {showSidebar && <Sidebar />}        {/* Displays sidebar in the page */}

                <div className="flex-1 flex flex-col">
                    <Navbar />                      {/* Displays navbar in the page */}

                    <main className="flex-1 overflow-y-auto">
                        {children}             {/* Displays the actual page we want (Homepage, Signuppage etc) */}
                    </main>
                </div>
            </div>
        </div>
    )
}

export default Layout
