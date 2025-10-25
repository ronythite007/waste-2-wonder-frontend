import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';

export default function Layout() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="h-16" /> {/* Spacer for fixed navbar */}
      <main className="px-4 sm:px-6 lg:px-8 pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
