import Sidebar from "@/components/SideBar";

function MessagePage() {
    return (
        <div>
            <Sidebar
                userType="artist"
                isCollapsed={true}
                hasMessages={true}
            />
        </div>
    );
}

export default MessagePage;
