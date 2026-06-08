import { useState, useMemo, useEffect } from 'react';
import Sidebar from "@/components/SideBar";
import SearchBar from "@/components/SearchBar";
import FilterDropdown from "@/components/FilterDropdown";
import ProducerCard from "@/components/ProducerCard";
import AudioPlayer from "@/components/AudioPlayer";
import { Activity, Compass, RefreshCw, XCircle } from 'lucide-react';
import { producerService, ProducerData } from '@/services/producerService';

function SearchPage() {
    const [producers, setProducers] = useState<ProducerData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("Todos");

    const fetchProducers = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await producerService.getAllProducers();
            setProducers(data);
        } catch (err) {
            setError("No se pudo conectar con el catálogo de productores.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducers();
    }, []);

    const availableCategories = useMemo(() => {
        const categoriesSet = new Set<string>();
        producers.forEach(p => {
            if (p.skills && Array.isArray(p.skills)) {
                p.skills.forEach(skill => categoriesSet.add(skill));
            }
        });
        return ["Todos", ...Array.from(categoriesSet)];
    }, [producers]);

    const filteredProducers = useMemo(() => {
        return producers.filter(producer => {
            const matchesSearch = (producer.fullName || "").toLowerCase().includes(search.toLowerCase());
            const matchesCategory = category === "Todos" || (producer.skills && producer.skills.includes(category));
            return matchesSearch && matchesCategory;
        });
    }, [producers, search, category]);

    const resetFilters = () => {
        setSearch("");
        setCategory("Todos");
    };

    return (
        <div className="flex bg-[#070708] min-h-screen text-light">
            <Sidebar />

            <main className="flex-1 min-w-0 overflow-y-auto px-4 md:px-12 pt-8 pb-32">

                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-white/5 pb-8">
                    <div>
                        <div className="flex items-center gap-2 text-artist font-black text-[10px] tracking-[0.3em] uppercase mb-1">
                            <Compass size={12} className="animate-spin-slow" /> Explorar Terminal
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">
                            Catálogo de <span className="text-subtitle/30">Productores</span>
                        </h1>
                    </div>

                    <button
                        onClick={fetchProducers}
                        disabled={isLoading}
                        className="self-start md:self-auto px-4 py-2 bg-white/2 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-subtitle/60 hover:text-light hover:border-white/20 transition-all flex items-center gap-2 disabled:opacity-40 cursor-pointer"
                    >
                        <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
                        Sincronizar Rack
                    </button>
                </header>

                <div className="flex flex-col md:flex-row gap-4 mb-10">
                    <div className="flex-1">
                        <SearchBar
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por nombre de productor o estudio..."
                        />
                    </div>
                    <div className="md:w-64">
                        <FilterDropdown
                            label="Género"
                            value={category}
                            options={availableCategories}
                            onChange={(val) => setCategory(val)}
                        />
                    </div>
                </div>

                <div className="relative">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-40">
                            <RefreshCw size={32} className="text-artist animate-spin mb-4" />
                            <p className="text-[10px] font-black text-subtitle/40 uppercase tracking-[0.2em]">Cargando frecuencias de la base de datos...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-32 border border-error/10 bg-error/5 rounded-3xl max-w-xl mx-auto text-center px-6">
                            <p className="text-xs font-bold text-error uppercase tracking-widest mb-1">Error de Enlace de Consola</p>
                            <p className="text-sm font-medium text-subtitle/60">{error}</p>
                        </div>
                    ) : filteredProducers.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-[1400px] mx-auto">
                            {filteredProducers.map((producer) => {
                                const safePrice = producer.price !== undefined && producer.price !== null
                                    ? Number(producer.price)
                                    : 0;

                                return (
                                    <ProducerCard
                                        key={producer.id}
                                        id={producer.id}
                                        fullName={producer.fullName}
                                        skills={producer.skills}
                                        profilePicture={producer.profilePicture || producer.avatarUrl || null}
                                        price={safePrice}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 border border-dashed border-white/5 rounded-3xl bg-white/1 max-w-xl mx-auto text-center px-4">
                            <Activity size={32} className="text-subtitle/10 mb-4" />
                            <p className="text-[10px] font-black text-subtitle/30 uppercase tracking-[0.3em] mb-2">No se encontraron productores</p>
                            <p className="text-xs text-subtitle/50 mb-6 font-medium max-w-xs">Ningún rack activo coincide con los criterios de filtrado seleccionados.</p>
                            <button
                                onClick={resetFilters}
                                className="px-3.5 py-2 bg-white/2 border border-white/5 hover:border-artist/30 text-artist rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-2 cursor-pointer"
                            >
                                <XCircle size={12} /> Restablecer Consola
                            </button>
                        </div>
                    )}
                </div>

                <AudioPlayer />
            </main>
        </div>
    );
}

export default SearchPage;