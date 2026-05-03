import React from 'react';
import Sidebar from "@/components/SideBar";
import ProfileHero from "@/components/ProfileHero";
import AudioPlayer from "@/components/AudioPlayer";
import RecentProductions from "@/components/RecentProductions";
import ServicesSidebar from '@/components/ServicesSidebar';

function ProducerProfilePage() {
    return (
        <div className="flex h-screen bg-dark overflow-hidden">
            <Sidebar userType="artist" isCollapsed={false} hasMessages={false} />

            <main className="flex-1 flex flex-col overflow-y-auto relative">
                <div className="p-10 w-full max-w-7xl mx-auto space-y-12">

                    <ProfileHero />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        <div className="lg:col-span-8 space-y-10">
                            <RecentProductions />
                        </div>

                        <div className="lg:col-span-4">
                            <ServicesSidebar />
                        </div>
                    </div>
                </div>

                <div className="pb-32" />
                <AudioPlayer />
            </main>
        </div>
    );
}

export default ProducerProfilePage;