import React, { useState } from 'react';
import { X, CreditCard, Wallet, Smartphone, Loader2, CheckCircle, Lock, AlertCircle } from 'lucide-react';
import { beatService } from '@/services/beatService';

interface BeatPurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    beat: {
        id: number;
        title: string;
        price: string;
        producerName?: string;
    };
    onSuccess: () => void;
}

export const BeatPurchaseModal: React.FC<BeatPurchaseModalProps> = ({ isOpen, onClose, beat, onSuccess }) => {
    const [selectedMethod, setSelectedMethod] = useState<'card' | 'paypal' | 'transfer'>('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [licenseType, setLicenseType] = useState<'standard' | 'premium' | 'exclusive'>('standard');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');

    const licensePrices = {
        standard: beat.price,
        premium: (parseFloat(beat.price) * 1.5).toFixed(2),
        exclusive: (parseFloat(beat.price) * 3).toFixed(2)
    };

    const licenseNames = {
        standard: 'Licencia Estándar',
        premium: 'Licencia Premium',
        exclusive: 'Licencia Exclusiva'
    };

    const licenseDescriptions = {
        standard: 'Uso en streaming, hasta 100k reproducciones',
        premium: 'Uso comercial, hasta 500k reproducciones',
        exclusive: 'Propiedad exclusiva del beat'
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setErrorMessage(null);

        if (selectedMethod === 'card') {
            if (cardNumber.length < 16) {
                setErrorMessage('Número de tarjeta inválido');
                setIsProcessing(false);
                return;
            }
            if (cardCvv.length < 3) {
                setErrorMessage('CVV inválido');
                setIsProcessing(false);
                return;
            }
        }

        try {
            await beatService.purchaseBeat(beat.id, licenseType);
            onSuccess();
            onClose();
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || error.message || 'Error al procesar la compra';
            setErrorMessage(errorMsg);
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-[#0b0b0d] border border-white/10 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <div>
                        <h2 className="text-lg font-black uppercase tracking-tighter">Adquirir Beat</h2>
                        <p className="text-[10px] text-subtitle/40 mt-1">{beat.title}</p>
                    </div>
                    <button onClick={onClose} className="text-subtitle/40 hover:text-light">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {errorMessage && (
                        <div className="bg-error/10 border border-error/30 rounded-xl p-3 flex items-center gap-2">
                            <AlertCircle size={14} className="text-error flex-shrink-0" />
                            <p className="text-[9px] text-error">{errorMessage}</p>
                        </div>
                    )}

                    <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                        <div className="flex justify-between mb-2">
                            <span className="text-[10px] text-subtitle/40">Productor:</span>
                            <span className="text-[10px] font-bold text-light">{beat.producerName || 'Productor'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[10px] text-subtitle/40">Precio base:</span>
                            <span className="text-base font-black text-success">{parseFloat(beat.price).toFixed(2)}€</span>
                        </div>
                    </div>

                    <div>
                        <label className="text-[8px] font-black uppercase text-subtitle/40 block mb-2">Tipo de Licencia</label>
                        <div className="space-y-2">
                            {(['standard', 'premium', 'exclusive'] as const).map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setLicenseType(type)}
                                    className={`w-full p-3 rounded-xl border transition-all text-left ${licenseType === type
                                        ? 'border-artist bg-artist/10'
                                        : 'border-white/10 hover:border-white/20'
                                        }`}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] font-black uppercase">{licenseNames[type]}</p>
                                            <p className="text-[7px] text-subtitle/40 mt-0.5">{licenseDescriptions[type]}</p>
                                        </div>
                                        <span className={`text-sm font-black ${licenseType === type ? 'text-artist' : 'text-success'}`}>
                                            {licensePrices[type]}€
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-[8px] font-black uppercase text-subtitle/40 block mb-2">Método de pago</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => setSelectedMethod('card')}
                                className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-1 ${selectedMethod === 'card'
                                    ? 'border-artist bg-artist/10'
                                    : 'border-white/10 hover:border-white/20'
                                    }`}
                            >
                                <CreditCard size={18} className={selectedMethod === 'card' ? 'text-artist' : 'text-subtitle/40'} />
                                <span className="text-[8px] font-black">Tarjeta</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedMethod('paypal')}
                                className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-1 ${selectedMethod === 'paypal'
                                    ? 'border-artist bg-artist/10'
                                    : 'border-white/10 hover:border-white/20'
                                    }`}
                            >
                                <Wallet size={18} className={selectedMethod === 'paypal' ? 'text-artist' : 'text-subtitle/40'} />
                                <span className="text-[8px] font-black">PayPal</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedMethod('transfer')}
                                className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-1 ${selectedMethod === 'transfer'
                                    ? 'border-artist bg-artist/10'
                                    : 'border-white/10 hover:border-white/20'
                                    }`}
                            >
                                <Smartphone size={18} className={selectedMethod === 'transfer' ? 'text-artist' : 'text-subtitle/40'} />
                                <span className="text-[8px] font-black">Transferencia</span>
                            </button>
                        </div>
                    </div>

                    {selectedMethod === 'card' && (
                        <div className="space-y-3">
                            <div>
                                <label className="text-[7px] font-black uppercase text-subtitle/40 block mb-1">Número de tarjeta</label>
                                <input
                                    type="text"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                                    placeholder="1234 5678 9012 3456"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-light focus:outline-none focus:border-artist/40"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[7px] font-black uppercase text-subtitle/40 block mb-1">Fecha expiración</label>
                                    <input
                                        type="text"
                                        value={cardExpiry}
                                        onChange={(e) => setCardExpiry(e.target.value)}
                                        placeholder="MM/YY"
                                        maxLength={5}
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-light focus:outline-none focus:border-artist/40"
                                    />
                                </div>
                                <div>
                                    <label className="text-[7px] font-black uppercase text-subtitle/40 block mb-1">CVV</label>
                                    <input
                                        type="text"
                                        value={cardCvv}
                                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                        placeholder="123"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-light focus:outline-none focus:border-artist/40"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedMethod === 'paypal' && (
                        <div className="bg-black/40 rounded-xl p-4 text-center border border-white/10">
                            <Wallet size={24} className="mx-auto text-artist mb-2" />
                            <p className="text-[9px] text-subtitle/60">Serás redirigido a PayPal para completar el pago</p>
                            <p className="text-[7px] text-subtitle/40 mt-1 text-artist">💰 Simulación - Modo de pruebas</p>
                        </div>
                    )}

                    {selectedMethod === 'transfer' && (
                        <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                            <p className="text-[9px] text-subtitle/60 text-center mb-3">Datos para transferencia bancaria</p>
                            <div className="space-y-1 text-[8px]">
                                <p className="flex justify-between"><span className="text-subtitle/40">Banco:</span><span className="text-light">AudioLink Bank</span></p>
                                <p className="flex justify-between"><span className="text-subtitle/40">Titular:</span><span className="text-light">AudioLink Studios</span></p>
                                <p className="flex justify-between"><span className="text-subtitle/40">IBAN:</span><span className="text-light">ES00 0000 0000 0000 0000 0000</span></p>
                                <p className="flex justify-between"><span className="text-subtitle/40">Concepto:</span><span className="text-light">Beat: {beat.title}</span></p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-center gap-2 text-[8px] text-subtitle/40">
                        <Lock size={10} />
                        <span>Pago seguro - SSL encriptado</span>
                    </div>
                </div>

                <div className="flex gap-3 p-6 border-t border-white/10">
                    <button
                        onClick={onClose}
                        disabled={isProcessing}
                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isProcessing}
                        className="flex-1 px-4 py-2 bg-artist text-black rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-artist/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                        {isProcessing ? 'Procesando...' : `Pagar ${licensePrices[licenseType]}€`}
                    </button>
                </div>
            </div>
        </div>
    );
};