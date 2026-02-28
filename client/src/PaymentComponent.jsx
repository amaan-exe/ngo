import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Heart, AlertTriangle } from 'lucide-react';
import { useToast } from './components/Toast';

const PRESET_AMOUNTS = [500, 1000, 2000, 5000];

const PaymentComponent = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        donor_name: '',
        email: '',
        amount: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error on change
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const selectPreset = (amount) => {
        setFormData(prev => ({ ...prev, amount: String(amount) }));
        if (errors.amount) setErrors(prev => ({ ...prev, amount: '' }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.donor_name.trim()) newErrors.donor_name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address';
        if (!formData.amount || Number(formData.amount) < 1) newErrors.amount = 'Minimum ₹1 required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        try {
            const { data: orderDetails } = await axios.post('/api/create-order', {
                ...formData,
                amount: Number(formData.amount)
            });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderDetails.amount,
                currency: orderDetails.currency,
                name: 'DEMO NGO',
                description: 'Donation for Food Distribution',
                order_id: orderDetails.orderId,
                handler: async function (response) {
                    try {
                        const verifyResult = await axios.post('/api/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        if (verifyResult.data.success) {
                            navigate('/payment-success', {
                                state: {
                                    donor_name: formData.donor_name,
                                    email: formData.email,
                                    amount: formData.amount,
                                    paymentId: response.razorpay_payment_id,
                                    orderId: response.razorpay_order_id,
                                }
                            });
                        }
                    } catch (err) {
                        console.error(err);
                        toast.error('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: formData.donor_name,
                    email: formData.email,
                },
                theme: {
                    color: '#2563eb'
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                console.error(response.error);
                toast.error('Payment failed. Please try again.');
            });
            rzp1.open();
        } catch (err) {
            console.error(err);
            toast.error('Could not create order. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100 relative overflow-hidden">
            {/* Decorative accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

            <div className="text-center mb-6">
                <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Heart className="h-7 w-7 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Make a Donation</h2>
                <p className="text-gray-500 text-sm mt-1">Every contribution helps us feed the hungry.</p>
            </div>

            <form onSubmit={handlePayment} className="space-y-4" noValidate>
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        name="donor_name"
                        value={formData.donor_name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.donor_name ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                        placeholder="John Doe"
                    />
                    {errors.donor_name && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> {errors.donor_name}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                        placeholder="john@example.com"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> {errors.email}
                        </p>
                    )}
                </div>

                {/* Preset Amounts */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quick Select</label>
                    <div className="grid grid-cols-4 gap-2">
                        {PRESET_AMOUNTS.map(amt => (
                            <button
                                key={amt}
                                type="button"
                                onClick={() => selectPreset(amt)}
                                className={`py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${String(amt) === formData.amount
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200 scale-105'
                                    : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
                                    }`}
                            >
                                ₹{amt.toLocaleString()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Amount Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Or Enter Amount (INR)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-2.5 text-gray-500 font-bold text-lg">₹</span>
                        <input
                            type="number"
                            name="amount"
                            min="1"
                            value={formData.amount}
                            onChange={handleChange}
                            className={`w-full pl-9 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-lg font-semibold ${errors.amount ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                            placeholder="1000"
                        />
                    </div>
                    {errors.amount && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> {errors.amount}
                        </p>
                    )}
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-lg shadow-blue-200 hover:shadow-blue-300 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Processing…
                        </>
                    ) : (
                        <>
                            Donate Now <Heart className="h-4 w-4 fill-current" />
                        </>
                    )}
                </button>
            </form>
            <p className="text-xs text-center text-gray-400 mt-4">🔒 Secured by Razorpay · 80G Tax Exemption available</p>
        </div>
    );
};

export default PaymentComponent;
