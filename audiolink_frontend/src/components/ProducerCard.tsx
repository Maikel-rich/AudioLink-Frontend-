import { Play } from 'lucide-react';
import Button from "@/components/Button";

interface ProducerCardProps {
    name: string;
    type: string;
    tags: string[];
}

const ProducerCard = ({ name, type, tags }: ProducerCardProps) => (
    <div className="bg-gray-dark border border-gray-light/30 rounded-2xl p-6 hover:border-artist/50 transition-all group">
        <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gray-light/20 border-2 border-gray-light" />
            <div>
                <h3 className="text-light font-bold text-lg leading-tight">{name}</h3>
                <p className="text-artist text-[10px] font-black tracking-widest uppercase mt-1">{type}</p>
                <div className="flex gap-2 mt-3">
                    {tags.map((tag: string) => (
                        <span key={tag} className="text-[10px] bg-dark text-subtitle px-2 py-1 rounded-md border border-gray-light/20">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-light/10">
            {/* Botón de Preview */}
            <button className="flex items-center gap-2 text-subtitle hover:text-light transition-colors group/btn">
                <div className="bg-artist p-2 rounded-full text-white group-hover/btn:scale-110 transition-transform">
                    <Play size={14} fill="currentColor" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">Preview</span>
            </button>

            {/* Botón Ver Perfil */}
            <Button
                variant="ghost"
                size="sm"
                className="text-artist hover:underline p-0"
            >
                Ver Perfil
            </Button>
        </div>
    </div>
);

export default ProducerCard;