import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, User, Activity, Volume2, ArrowRight } from 'lucide-react';
import { ROUTES } from "@/constants/routes";

interface ProducerCardProps {
    name: string;
    type: string;
    tags: string[];
    price: number;
    image: string;
}

const ProducerCard = ({ name, type, tags, price, image }: ProducerCardProps) => {
    const navigate = useNavigate();

    const goToProfile = () => {
        navigate(`${ROUTES.PRODUCER_PROFILE}`);
    };

    return (
        <div className="group relative flex bg-[#0d0d0f] rounded-xl overflow-hidden h-32 border border-light/3 transition-all duration-500 hover:border-artist/40 hover:bg-[#111114] shadow-lg">
            <div
                className="w-32 h-full relative shrink-0 overflow-hidden cursor-pointer group/play"
                onClick={(e) => {
                    e.stopPropagation();
                    console.log("Reproduciendo preview de:", name);
                }}
            >
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover grayscale opacity-40 group-hover/play:opacity-80 group-hover/play:scale-110 transition-all duration-700"
                />

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-light/10 flex items-center justify-center group-hover/play:bg-artist group-hover/play:border-artist group-hover/play:scale-105 transition-all shadow-2xl">
                        <Play size={20} className="text-light fill-current ml-1 transition-transform group-active/play:scale-90" />
                    </div>
                </div>

                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2 py-0.5 bg-black/40 rounded-full border border-light/5 opacity-0 group-hover/play:opacity-100 transition-opacity">
                    <Volume2 size={10} className="text-artist" />
                    <span className="text-[7px] font-black text-light uppercase tracking-tighter">Preview</span>
                </div>
            </div>

            <div
                className="flex-1 p-4 flex flex-col justify-between overflow-hidden cursor-pointer"
                onClick={goToProfile}
            >
                <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                        <Activity size={10} className="text-artist/60" />
                        <span className="text-[7px] font-black text-subtitle/40 uppercase tracking-[0.2em] truncate">{type}</span>
                    </div>
                    <h3 className="text-lg font-black text-light uppercase tracking-tighter truncate leading-tight group-hover:text-artist transition-colors">
                        {name}
                    </h3>
                    <div className="flex gap-2 mt-2 opacity-60">
                        {tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[7px] font-bold text-subtitle/60 uppercase tracking-widest px-1.5 py-0.5 border border-light/5 rounded-sm bg-light/2">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex items-end justify-between">
                    <div>
                        <span className="block text-[6px] font-black text-subtitle/20 uppercase tracking-widest">Fee desde</span>
                        <span className="text-sm font-black text-light tracking-tighter">${price}</span>
                    </div>
                    <div className="flex gap-1">
                        {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-artist/20 rounded-full" />)}
                    </div>
                </div>
            </div>

            <button
                onClick={goToProfile}
                className="w-14 flex flex-col items-center justify-center gap-2 bg-light/2 hover:bg-artist border-l border-light/5 transition-all group/profile"
            >
                <div className="p-2 rounded-lg bg-light/5 group-hover/profile:bg-light/20 transition-colors">
                    <User size={16} className="text-subtitle/40 group-hover/profile:text-light" />
                </div>
                <span className="text-[7px] font-black text-subtitle/20 group-hover/profile:text-light uppercase tracking-tighter leading-none">
                    Perfil
                </span>
                <ArrowRight size={10} className="text-subtitle/10 group-hover/profile:text-light mt-1 translate-x-0.5 group-hover:translate-x-0 transition-transform" />
            </button>

            <div className="absolute bottom-0 left-0 h-0.5 bg-artist opacity-0 group-hover:opacity-100 transition-opacity" style={{ width: '32px' }} />
        </div>
    );
};

export default ProducerCard;