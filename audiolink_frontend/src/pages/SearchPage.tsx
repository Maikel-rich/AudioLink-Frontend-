import React, { useState } from 'react';
import Sidebar from "@/components/SideBar";
import SearchBar from "@/components/SearchBar";
import FilterDropdown from "@/components/FilterDropdown";
import PriceSlider from "@/components/PriceSlider";
import Button from "@/components/Button";
import ProducerCard from "@/components/ProducerCard";
import AudioPlayer from "@/components/AudioPlayer"; // Importamos el nuevo reproductor

const PRODUCERS = Array(9).fill({
    name: "Alex Rivers",
    type: "PRODUCTOR PLATINO",
    tags: ["Hip-Hop", "Trap", "Drill"],
});

function SearchPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [genre, setGenre] = useState("Hip-Hop");
    const [service, setService] = useState("Producción Completa");
    const [priceRange, setPriceRange] = useState({ min: 100, max: 500 });

    const handleSearch = () => {
        const filters = {
            query: searchQuery,
            genre: genre,
            service: service,
            price: priceRange
        };
        console.log("Ejecutando búsqueda con:", filters);
    };

    return (
        <div className="flex h-screen bg-dark overflow-hidden">
            <Sidebar userType="artist" isCollapsed={false} hasMessages={true} />

            <main className="flex-1 flex flex-col overflow-y-auto relative">
                <div className="sticky top-0 z-20 bg-dark p-8 pb-4 space-y-6">
                    <section className="space-y-6">
                        <SearchBar
                            value={searchQuery}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        />

                        <div className="flex flex-wrap items-center gap-4">
                            <FilterDropdown
                                label="Género"
                                value={genre}
                                options={["Hip-Hop", "Trap", "Drill", "R&B", "Reggaeton"]}
                                onChange={setGenre}
                            />
                            <FilterDropdown
                                label="Servicio"
                                value={service}
                                options={["Producción Completa", "Mixing", "Mastering", "Vocal Tuning"]}
                                onChange={setService}
                            />
                            <PriceSlider
                                min={priceRange.min}
                                max={priceRange.max}
                                onChange={setPriceRange}
                            />

                            <Button
                                variant="artist"
                                size="md"
                                className="ml-auto"
                                onClick={handleSearch}
                            >
                                BUSCAR
                            </Button>
                        </div>
                    </section>
                    <div className="w-full h-px bg-gray-light/20" />
                </div>

                {/* Grid de Contenido */}
                <div className="p-8 pt-4 w-full max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-32">
                        {PRODUCERS.map((producer, index) => (
                            <ProducerCard key={index} {...producer} />
                        ))}
                    </div>
                </div>

                <AudioPlayer />
            </main>
        </div>
    );
}

export default SearchPage;