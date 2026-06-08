import React, { useState } from 'react';
import { X, CreditCard, Wallet, Smartphone, Loader2, CheckCircle, Lock } from 'lucide-react';
import { ProposalData, serviceRequestService } from '@/services/serviceRequestService';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    proposal: ProposalData;
    paymentType: 'deposit' | 'remaining';
    onSuccess: (proposalId: number) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, proposal, paymentType, onSuccess }) => {
    const [selectedMethod, setSelectedMethod] = useState<'card' | 'paypal' | 'transfer'>('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');

    const isDeposit = paymentType === 'deposit';
    const paymentAmount = (proposal.amount / 2).toFixed(2);
    const title = isDeposit ? 'Pago de Adelanto (50%)' : 'Pago Restante (50%)';
    const description = isDeposit
        ? 'Paga el 50% por adelantado para comenzar el proyecto'
        : 'Completa el pago del 50% restante para finalizar el proyecto';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            if (isDeposit) {
                await serviceRequestService.payDeposit(proposal.id);
            } else {
                await serviceRequestService.payRemaining(proposal.id);
            }

            setTimeout(() => {
                onSuccess(proposal.id);
            }, 1000);
        } catch (error) {
            // Error silencioso para producción
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-[#0b0b0d] border border-white/10 rounded-2xl max-w-md w-full">
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <div>
                        <h2 className="text-lg font-black uppercase tracking-tighter">{title}</h2>
                        <p className="text-[10px] text-subtitle/40 mt-1">{description}</p>
                    </div>
                    <button onClick={onClose} className="text-subtitle/40 hover:text-light">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                        <div className="flex justify-between mb-2">
                            <span className="text-[10px] text-subtitle/40">Servicio:</span>
                            <span className="text-[10px] font-bold text-light">{proposal.service_name}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-[10px] text-subtitle/40">Productor:</span>
                            <span className="text-[10px] font-bold text-light">{proposal.producer.full_name}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-white/10 mt-2">
                            <span className="text-[11px] font-black text-subtitle/40">Total:</span>
                            <span className="text-lg font-black text-success">{proposal.amount.toFixed(2)}€</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[10px] text-artist">{isDeposit ? 'Adelanto (50%)' : 'Restante (50%)'}:</span>
                            <span className="text-base font-black text-artist">{paymentAmount}€</span>
                        </div>
                    </div>

                    <div>
                        <label className="text-[8px] font-black uppercase text-subtitle/40 block mb-2">Método de pago</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
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
                        <form className="space-y-3">
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
                        </form>
                    )}

                    {selectedMethod === 'paypal' && (
                        <div className="bg-black/40 rounded-xl p-4 text-center border border-white/10">
                            <Wallet size={24} className="mx-auto text-artist mb-2" />
                            <p className="text-[9px] text-subtitle/60">Serás redirigido a PayPal para completar el pago</p>
                            <p className="text-[7px] text-subtitle/40 mt-1">Simulación - Entorno de pruebas</p>
                        </div>
                    )}

                    {selectedMethod === 'transfer' && (
                        <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                            <p className="text-[9px] text-subtitle/60 text-center mb-3">Datos para transferencia bancaria</p>
                            <div className="space-y-1 text-[8px]">
                                <p className="flex justify-between"><span className="text-subtitle/40">Banco:</span><span className="text-light">AudioLink Bank</span></p>
                                <p className="flex justify-between"><span className="text-subtitle/40">Titular:</span><span className="text-light">AudioLink Studios</span></p>
                                <p className="flex justify-between"><span className="text-subtitle/40">IBAN:</span><span className="text-light">ES00 0000 0000 0000 0000 0000</span></p>
                                <p className="flex justify-between"><span className="text-subtitle/40">Concepto:</span><span className="text-light">Pago #{proposal.id}</span></p>
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
                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isProcessing}
                        className="flex-1 px-4 py-2 bg-artist text-black rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-artist/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                        {isProcessing ? 'Procesando...' : `Pagar ${paymentAmount}€`}
                    </button>
                </div>
            </div>
        </div>
    );
};