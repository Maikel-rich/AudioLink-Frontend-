import Sidebar from "@/components/SideBar";

function FinishedProjectsPage() {
    return (
        <div>
            <Sidebar
                userType="artist"
                isCollapsed={false}
                hasMessages={true}
            />
        </div>
    );
}

export default FinishedProjectsPage;
