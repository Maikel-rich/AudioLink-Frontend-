import { useState, useMemo } from 'react';
import Sidebar from "@/components/SideBar";
import SearchBar from "@/components/SearchBar";
import Button from "@/components/Button";
import ProducerCard from "@/components/ProducerCard";
import AudioPlayer from "@/components/AudioPlayer";
import { ChevronDown, Activity, Compass } from 'lucide-react';

const PRODUCERS_DATA = [
    { id: 1, name: "Kael Beats", type: "PLATINUM", tags: ["Trap", "Drill"], rating: 5.0, price: 299, category: "Urbano", image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070" },
    { id: 2, name: "Elena Rose", type: "ELITE", tags: ["R&B", "Soul"], rating: 4.9, price: 450, category: "R&B", image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2070" },
    { id: 3, name: "Dímelo Flow", type: "MASTER", tags: ["Reggaeton", "Pop"], rating: 4.8, price: 800, category: "Urbano", image: "https://images.unsplash.com/photo-1571235962067-15c016140ee4?q=80&w=2070" },
    { id: 4, name: "Alex Rivers", type: "GOLD", tags: ["Electronic", "Techno"], rating: 4.7, price: 150, category: "Electronic", image: "https://images.unsplash.com/photo-1557133357-6113b246603a?q=80&w=2070" },
];

function SearchPage() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("Todos");

    const filteredProducers = useMemo(() => {
        return PRODUCERS_DATA.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
            const matchesCat = category === "Todos" || p.category === category;
            return matchesSearch && matchesCat;
        });
    }, [search, category]);

    return (
        <div className="flex h-screen bg-[#08080a] text-light overflow-hidden">
            <Sidebar userType="artist" isCollapsed={false} />

            <main className="flex-1 flex flex-col relative overflow-hidden">
                <header className="px-10 py-8 flex justify-between items-end sticky top-0 bg-[#08080a]/80 backdrop-blur-md z-20">
                    <div>
                        <div className="flex items-center gap-3 mb-2 font-black">
                            <Compass size={18} className="text-artist animate-pulse" />
                            <span className="text-[10px] text-artist uppercase tracking-[0.4em]">Descubrir productores</span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase">Explorar <span className="text-subtitle/40">Talento</span></h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right mr-4 border-r border-white/10 pr-6">
                            <p className="text-[9px] font-black text-subtitle/20 uppercase tracking-widest">Todos los productores</p>
                            <p className="text-xs font-black text-artist tracking-widest uppercase">{filteredProducers.length} Disponibles</p>
                        </div>
                        <Button className="h-12 px-8 uppercase font-black tracking-widest text-[11px] rounded-xl shadow-lg shadow-artist/10">
                            Actualizar Lista
                        </Button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-10 pb-32">
                    <div className="py-6 px-8 mb-10 bg-gray-dark/30 border border-white/5 rounded-2xl flex gap-8 items-center sticky top-4 z-10 backdrop-blur-xl">
                        <div className="flex-1">
                            <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="FILTRAR POR NOMBRE O TAGS..." />
                        </div>

                        <div className="flex gap-8 items-center">
                            <div className="flex flex-col gap-1">
                                <span className="text-[8px] font-black text-subtitle/20 uppercase tracking-[0.2em]">Género Principal</span>
                                <div className="relative">
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="bg-transparent text-[10px] font-black text-subtitle/60 uppercase tracking-widest outline-none cursor-pointer pr-5 appearance-none hover:text-artist transition-colors"
                                    >
                                        <option value="Todos">Todos</option>
                                        <option value="Urbano">Urbano</option>
                                        <option value="R&B">R&B</option>
                                        <option value="Electronic">Electronic</option>
                                    </select>
                                    <ChevronDown size={12} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-subtitle/30" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {filteredProducers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducers.map((producer) => (
                                <ProducerCard key={producer.id} {...producer} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-white/5 rounded-4xl bg-white/1">
                            <Activity size={48} className="text-subtitle/10 mb-4" />
                            <p className="text-[10px] font-black text-subtitle/20 uppercase tracking-[0.5em]">Sin coincidencias</p>
                        </div>
                    )}
                </div>

                <AudioPlayer />
            </main>
        </div>
    );
}

export default SearchPage;