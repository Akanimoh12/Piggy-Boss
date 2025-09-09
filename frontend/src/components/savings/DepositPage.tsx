import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const DepositPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Create Deposit</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Deposit Feature Coming Soon
            </h2>
            <p className="text-gray-500">
              This feature is currently under development.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositPage;