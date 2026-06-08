import React, { useState, useEffect, ChangeEvent } from 'react';
import Sidebar from "@/components/SideBar";
import { cloudinaryService } from '@/services/cloudinaryService';
import { producerService } from '@/services/producerService';
import { studioService, StudioServiceUI } from '@/services/studioService';
import { beatService, BeatResponse } from '@/services/beatService';
import { StudioHeader } from '@/components/studio/StudioHeader';
import { IdentitySection } from '@/components/studio/IdentitySection';
import { FeaturedBeatSection } from '@/components/studio/FeaturedBeatSection';
import { ServicesSection } from '@/components/studio/ServicesSection';
import { BeatsCatalogSection } from '@/components/studio/BeatsCatalogSection';
import { AddBeatModal } from '@/components/studio/AddBeatModal';
import { CheckCircle } from 'lucide-react';

interface ForSaleBeat {
    title: string;
    genre: string;
    price: string;
    licenseType: string;
    coverUrl: string | null;
    taggedAudioUrl: string | null;
    untaggedAudioUrl: string | null;
    bpm: number | string;
    keySignature: string;
}

interface ProducerProfileState {
    fullName: string;
    bio: string;
    avatarUrl: string | null;
    services: StudioServiceUI[];
    featuredBeat: ForSaleBeat;
}

interface NewServiceState {
    title: string;
    price: string;
    desc: string;
}

export const MyStudioPage: React.FC = () => {
    const [producerId, setProducerId] = useState<number | null>(null);
    const [profile, setProfile] = useState<ProducerProfileState>({
        fullName: "",
        bio: "",
        avatarUrl: null,
        services: [],
        featuredBeat: {
            title: "",
            genre: "Trap",
            price: "0.00",
            licenseType: "LEASE",
            coverUrl: null,
            taggedAudioUrl: null,
            untaggedAudioUrl: null,
            bpm: "",
            keySignature: ""
        }
    });

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [uploadingAvatar, setUploadingAvatar] = useState<boolean>(false);
    const [uploadingCover, setUploadingCover] = useState<boolean>(false);
    const [uploadingTagged, setUploadingTagged] = useState<boolean>(false);
    const [uploadingUntagged, setUploadingUntagged] = useState<boolean>(false);

    const [newService, setNewService] = useState<NewServiceState>({ title: "", price: "", desc: "" });

    const [myBeats, setMyBeats] = useState<BeatResponse[]>([]);
    const [showAllBeats, setShowAllBeats] = useState<boolean>(false);
    const [loadingBeats, setLoadingBeats] = useState<boolean>(false);
    const [showAddBeatModal, setShowAddBeatModal] = useState<boolean>(false);
    const [currentFeaturedId, setCurrentFeaturedId] = useState<number | null>(null);

    const loadAllMyBeats = async (): Promise<void> => {
        try {
            setLoadingBeats(true);
            const beats = await beatService.getMyBeats();
            setMyBeats(beats);
        } catch (error) {
            // Error silencioso en producción
        } finally {
            setLoadingBeats(false);
        }
    };

    const loadFeaturedBeat = async (): Promise<void> => {
        try {
            const featured = await beatService.getMyFeaturedBeat();

            if (featured) {
                setProfile(prev => ({
                    ...prev,
                    featuredBeat: {
                        title: featured.title || "",
                        genre: featured.genre || "Trap",
                        price: featured.price || "0.00",
                        licenseType: "LEASE",
                        coverUrl: featured.cloudinaryUrl || null,
                        taggedAudioUrl: featured.taggedAudioUrl || null,
                        untaggedAudioUrl: featured.untaggedAudioUrl || null,
                        bpm: featured.bpm || "",
                        keySignature: featured.keySignature || ""
                    }
                }));
                setCurrentFeaturedId(featured.id);
            } else {
                setCurrentFeaturedId(null);
            }
        } catch (error) {
            // Error silencioso en producción
        }
    };

    const handleAddBeat = async (beatData: any): Promise<void> => {
        try {
            await beatService.createBeat(beatData);
            await loadAllMyBeats();
            setSuccessMessage("Beat añadido correctamente al catálogo");
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error: any) {
            // Error silencioso en producción
        }
    };

    const handleDeleteBeat = async (beatId: number): Promise<void> => {
        if (!confirm('¿Eliminar este beat permanentemente?')) return;
        try {
            await beatService.deleteBeat(beatId);
            await loadAllMyBeats();
            await loadFeaturedBeat();
            setSuccessMessage("Beat eliminado correctamente");
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            // Error silencioso en producción
        }
    };

    const handleMarkAsSold = async (beatId: number): Promise<void> => {
        if (!confirm('¿Marcar este beat como vendido?')) return;
        try {
            await beatService.markAsSold(beatId);
            await loadAllMyBeats();
            await loadFeaturedBeat();
            setSuccessMessage("Beat marcado como vendido");
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            // Error silencioso en producción
        }
    };

    const handleSetFeatured = async (beatId: number): Promise<void> => {
        try {
            await beatService.setFeaturedBeat(beatId);
            await loadFeaturedBeat();
            await loadAllMyBeats();
            setSuccessMessage("Beat destacado actualizado correctamente");
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (error) {
            // Error silencioso en producción
        }
    };

    const getNonFeaturedBeats = (): BeatResponse[] => {
        return myBeats.filter(beat => !beat.isFeatured);
    };

    const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploadingAvatar(true);
            const url = await cloudinaryService.uploadFileSecure(file);
            setProfile(prev => ({ ...prev, avatarUrl: url }));
        } catch {
            // Error silencioso en producción
        } finally {
            setUploadingAvatar(false);
        }
    };

    const handleBeatCoverUpload = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploadingCover(true);
            const url = await cloudinaryService.uploadFileSecure(file);
            setProfile(prev => ({
                ...prev,
                featuredBeat: { ...prev.featuredBeat, coverUrl: url }
            }));
        } catch {
            // Error silencioso en producción
        } finally {
            setUploadingCover(false);
        }
    };

    const handleAudioUpload = async (e: ChangeEvent<HTMLInputElement>, type: 'tagged' | 'untagged'): Promise<void> => {
        const file = e.target.files?.[0];
        if (!file) return;

        const ext = file.name.split('.').pop()?.toLowerCase();
        if ((type === 'tagged' && ext !== 'mp3') || (type === 'untagged' && ext !== 'wav')) {
            return;
        }

        try {
            type === 'tagged' ? setUploadingTagged(true) : setUploadingUntagged(true);
            const url = await cloudinaryService.uploadFileSecure(file);
            setProfile(prev => ({
                ...prev,
                featuredBeat: {
                    ...prev.featuredBeat,
                    [type === 'tagged' ? 'taggedAudioUrl' : 'untaggedAudioUrl']: url
                }
            }));
        } catch {
            // Error silencioso en producción
        } finally {
            type === 'tagged' ? setUploadingTagged(false) : setUploadingUntagged(false);
        }
    };

    const handleAddService = (): void => {
        if (!newService.title || !newService.price) return;
        const newServiceItem: StudioServiceUI = {
            id: `new-${Date.now()}`,
            title: newService.title,
            price: newService.price,
            description: newService.desc,
            features: []
        };
        setProfile(prev => ({ ...prev, services: [...prev.services, newServiceItem] }));
        setNewService({ title: "", price: "", desc: "" });
    };

    const handleRemoveService = (id: string | number): void => {
        setProfile(prev => ({ ...prev, services: prev.services.filter(s => s.id !== id) }));
    };

    const handleSaveProfile = async (): Promise<void> => {
        if (!producerId) return;
        setIsSaving(true);

        try {
            await producerService.updateMyProfile({
                fullName: profile.fullName,
                bio: profile.bio,
                avatarUrl: profile.avatarUrl,
            });

            if (profile.featuredBeat.title.trim()) {
                const cleanPrice = parseFloat(profile.featuredBeat.price.replace(/[^0-9.]/g, '')).toFixed(2);
                await beatService.saveFeaturedBeat({
                    title: profile.featuredBeat.title.trim(),
                    genre: profile.featuredBeat.genre,
                    price: parseFloat(cleanPrice),
                    coverUrl: profile.featuredBeat.coverUrl || "",
                    taggedAudioUrl: profile.featuredBeat.taggedAudioUrl,
                    untaggedAudioUrl: profile.featuredBeat.untaggedAudioUrl,
                    bpm: Number(profile.featuredBeat.bpm) || undefined,
                    keySignature: profile.featuredBeat.keySignature || undefined
                });
                await loadAllMyBeats();
                await loadFeaturedBeat();
            }

            await studioService.syncProducerServices(producerId, profile.services);
            const updatedServices = await studioService.getServicesByProducer(producerId);
            setProfile(prev => ({ ...prev, services: updatedServices }));

            setIsEditing(false);
            setSuccessMessage("Configuración procesada con éxito.");
            setTimeout(() => setSuccessMessage(null), 4000);
        } catch (error) {
            // Error silencioso en producción
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        const loadStudioData = async (): Promise<void> => {
            try {
                setIsLoading(true);
                const myProfile = await producerService.getMyProfile();

                setProducerId(myProfile.id);

                const backendServicesMapped = await studioService.getServicesByProducer(myProfile.id);

                await loadFeaturedBeat();
                await loadAllMyBeats();

                let cleanBio = myProfile.bio || "";
                if (cleanBio.trim().startsWith('{')) {
                    try {
                        const parsedBioObj = JSON.parse(cleanBio);
                        if (parsedBioObj?.bio) cleanBio = parsedBioObj.bio;
                    } catch (e) {
                        // Error silencioso en producción
                    }
                }

                const genresArray = myProfile.genres || myProfile.skills || [];

                setProfile(prev => ({
                    ...prev,
                    fullName: myProfile.fullName || "",
                    bio: cleanBio,
                    avatarUrl: myProfile.profilePicture || null,
                    services: backendServicesMapped,
                }));

            } catch (error) {
                // Error silencioso en producción
            } finally {
                setIsLoading(false);
            }
        };
        loadStudioData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-screen bg-[#060608] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-producer border-t-transparent rounded-full animate-spin" />
                    <p className="text-[10px] font-black tracking-[0.3em] text-subtitle/60">Sincronizando...</p>
                </div>
            </div>
        );
    }

    const nonFeaturedBeats = getNonFeaturedBeats();

    return (
        <div className="flex h-screen bg-[#060608] text-light overflow-hidden">
            <Sidebar userType="producer" isCollapsed={false} />

            <main className="flex-1 overflow-y-auto p-8 md:p-12 pb-32">
                <div className="max-w-6xl mx-auto space-y-10">

                    {successMessage && (
                        <div className="p-4 bg-success/10 border border-success/20 text-success rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-3 animate-fade-in">
                            <CheckCircle size={16} /> {successMessage}
                        </div>
                    )}

                    <StudioHeader
                        isEditing={isEditing}
                        isSaving={isSaving}
                        onEdit={() => setIsEditing(true)}
                        onSave={handleSaveProfile}
                        disabled={isSaving || uploadingAvatar || uploadingCover || uploadingTagged || uploadingUntagged}
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        <IdentitySection
                            fullName={profile.fullName}
                            bio={profile.bio}
                            avatarUrl={profile.avatarUrl}
                            isEditing={isEditing}
                            uploadingAvatar={uploadingAvatar}
                            onFullNameChange={(value: string) => setProfile(prev => ({ ...prev, fullName: value }))}
                            onBioChange={(value: string) => setProfile(prev => ({ ...prev, bio: value }))}
                            onAvatarUpload={handleAvatarUpload}
                        />

                        <FeaturedBeatSection
                            beat={profile.featuredBeat}
                            isEditing={false}
                            uploadingCover={uploadingCover}
                            uploadingTagged={uploadingTagged}
                            uploadingUntagged={uploadingUntagged}
                            onFieldChange={(field: string, value: string) => { }}
                            onCoverUpload={handleBeatCoverUpload}
                            onAudioUpload={handleAudioUpload}
                        />
                    </div>

                    <ServicesSection
                        services={profile.services}
                        isEditing={isEditing}
                        newService={newService}
                        onNewServiceChange={(field: keyof NewServiceState, value: string) =>
                            setNewService(prev => ({ ...prev, [field]: value }))
                        }
                        onAddService={handleAddService}
                        onRemoveService={handleRemoveService}
                    />

                    <BeatsCatalogSection
                        beats={nonFeaturedBeats}
                        loading={loadingBeats}
                        showAll={showAllBeats}
                        onToggleShow={() => setShowAllBeats(!showAllBeats)}
                        onMarkAsSold={handleMarkAsSold}
                        onDeleteBeat={handleDeleteBeat}
                        onSetFeatured={handleSetFeatured}
                        onAddBeat={() => setShowAddBeatModal(true)}
                        currentFeaturedId={currentFeaturedId || undefined}
                    />

                </div>
            </main>

            <AddBeatModal
                isOpen={showAddBeatModal}
                onClose={() => setShowAddBeatModal(false)}
                onSave={handleAddBeat}
            />
        </div>
    );
};

export default MyStudioPage;