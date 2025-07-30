import React, { useState } from 'react';
import axios from 'axios';

const PaymentForm = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [txRef, setTxRef] = useState(''); // Transaction reference
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Function to generate txRef (transaction reference)
  const generateTxRef = () => {
    return `TX-${Date.now()}`;  // Use current timestamp or UUID
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear any previous error
    setLoading(true);

    // Simple client-side validation
    if (!email || !phone || !amount || isNaN(Number(amount)) || !firstName || !lastName) {
      setError('Please fill in all fields correctly.');
      setLoading(false);
      return;
    }

    if (Number(amount) <= 0) {
      setError('Amount should be a positive number.');
      setLoading(false);
      return;
    }

    // Generate txRef
    const generatedTxRef = generateTxRef();
    setTxRef(generatedTxRef);

    try {
      const paymentData = {
        amount,
        email,
        phone,
        first_name: firstName,
        last_name: lastName,
        tx_ref: generatedTxRef,
        callback_url: 'https://yourapp.com/callback', // Your callback URL
        return_url: 'https://yourapp.com/return',    // Your return URL
        title: 'Payment for my favourite merchant',  // Optional: Customize
        description: 'Payment for online store',     // Optional: Customize
        hide_receipt: 'true',                         // Optional: Customize
      };

      const response = await axios.post(`http://localhost:${process.env.PORT}/api/payment`, paymentData);

      const { data } = response;
      if (data.status === 'success') {
        window.location.href = data.payment_url; // Redirect to Chapa payment page
      } else {
        setError('Payment initiation failed.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setError('An error occurred while processing your payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg space-y-6 sm:max-w-md">
      <h2 className="text-2xl font-bold text-center text-gray-800">Complete Your Payment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name & Last Name (Row Layout) */}
        <div className="flex space-x-4">
          <div className="w-full">
            <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
              First Name:
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-full">
            <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
              Last Name:
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email:
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Phone Input */}
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
            Phone:
          </label>
          <input
            id="phone"
            type="text"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Amount Input */}
        <div>
          <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
            Amount:
          </label>
          <input
            id="amount"
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
