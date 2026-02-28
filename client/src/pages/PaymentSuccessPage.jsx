import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Download, Heart, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function PaymentSuccessPage() {
    const location = useLocation();
    const data = location.state || {};
    const [copied, setCopied] = useState(false);

    const {
        donor_name = 'Donor',
        email = '',
        amount = 0,
        paymentId = '',
        orderId = '',
    } = data;

    const date = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const time = new Date().toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
    });

    const copyPaymentId = () => {
        navigator.clipboard.writeText(paymentId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // If no payment data, show fallback
    if (!paymentId) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <div className="text-center">
                    <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">No Payment Data</h2>
                    <p className="text-gray-400 mb-6">It looks like you arrived here directly. Please make a donation first.</p>
                    <Link to="/" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition">
                        Go to Home <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] bg-gradient-to-b from-emerald-50 via-white to-white flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-lg">

                {/* Success Animation */}
                <div className="text-center mb-8">
                    <div className="relative inline-block">
                        <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-200 animate-success-pop">
                            <CheckCircle className="h-12 w-12 text-white" />
                        </div>
                        {/* Decorative rings */}
                        <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full border-4 border-emerald-200 animate-ping opacity-20"></div>
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mt-6 mb-2">Payment Successful!</h1>
                    <p className="text-gray-500">Thank you for your generous donation, <span className="font-semibold text-gray-700">{donor_name}</span></p>
                </div>

                {/* Receipt Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Gradient Header */}
                    <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-6 text-white text-center">
                        <p className="text-emerald-100 text-sm font-medium mb-1">Amount Donated</p>
                        <p className="text-4xl font-extrabold">₹{parseFloat(amount).toLocaleString('en-IN')}</p>
                    </div>

                    {/* Details */}
                    <div className="px-8 py-6 space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-gray-50">
                            <span className="text-sm text-gray-500">Donor Name</span>
                            <span className="text-sm font-semibold text-gray-900">{donor_name}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-50">
                            <span className="text-sm text-gray-500">Email</span>
                            <span className="text-sm font-semibold text-gray-900">{email}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-50">
                            <span className="text-sm text-gray-500">Date & Time</span>
                            <span className="text-sm font-semibold text-gray-900">{date}, {time}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-50">
                            <span className="text-sm text-gray-500">Payment ID</span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-mono font-semibold text-gray-900">{paymentId}</span>
                                <button onClick={copyPaymentId} className="p-1 hover:bg-gray-100 rounded transition" title="Copy">
                                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 text-gray-400" />}
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center py-3">
                            <span className="text-sm text-gray-500">Status</span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                                <CheckCircle className="h-3.5 w-3.5" /> Verified
                            </span>
                        </div>
                    </div>

                    {/* Tax Info */}
                    <div className="mx-8 mb-6 bg-blue-50 border border-blue-100 rounded-xl px-5 py-3.5 text-center">
                        <p className="text-sm text-blue-700 font-medium">
                            🧾 This donation is eligible for <strong>80G Tax Exemption</strong>
                        </p>
                        <p className="text-xs text-blue-500 mt-1">A receipt has been sent to your email.</p>
                    </div>

                    {/* Actions */}
                    <div className="px-8 pb-8 flex flex-col gap-3">
                        <Link
                            to="/"
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-xl text-center hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                        >
                            Make Another Donation <Heart className="h-4 w-4 fill-current" />
                        </Link>
                        <Link
                            to="/"
                            className="w-full border border-gray-200 text-gray-600 font-medium py-3 rounded-xl text-center hover:bg-gray-50 transition"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>

                {/* Footer note */}
                <p className="text-center text-xs text-gray-400 mt-6">
                    If you have any questions, contact us at <a href="mailto:support@demongo.org" className="text-blue-500 hover:underline">support@demongo.org</a>
                </p>
            </div>
        </div>
    );
}
