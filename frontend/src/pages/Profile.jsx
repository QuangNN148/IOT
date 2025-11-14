// Profile Page - Thông tin sinh viên
import React, { useState, useEffect } from 'react';
import { getProfile } from '../services/api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getProfile();
        if (response.success) {
          setProfile(response.data);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-8">
        <div className="text-center py-8">
          <p className="text-red-500">Không thể tải thông tin profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Profile</h1>
        <p className="text-sm text-gray-500">Thông tin sinh viên</p>
      </div>

      {/* Profile Card with centered layout like mockup */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Profile Info Section */}
          <div className="bg-gradient-to-br from-cyan-100 to-blue-200 rounded-2xl p-6 mb-6 flex items-center space-x-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                <img 
                  src="https://i.pinimg.com/736x/70/a5/52/70a552e8e955049c8587b2d7606cd6a6.jpg" 
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Info */}
            <div className="flex-1">
              <div className="space-y-2">
                <p className="text-sm text-gray-700"><span className="font-semibold">Họ Tên:</span> {profile.name}</p>
                <p className="text-sm text-gray-700"><span className="font-semibold">MSV:</span> {profile.msv}</p>
                <p className="text-sm text-gray-700"><span className="font-semibold">Lớp:</span> {profile.class}</p>
                <p className="text-sm text-gray-700"><span className="font-semibold">SĐT:</span> {profile.phone}</p>
                <p className="text-sm text-gray-700"><span className="font-semibold">Email:</span> {profile.email}</p>
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Tài Liệu */}
            <a
              href={profile.links.docs}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-2xl p-6 hover:shadow-lg transition-all hover:scale-105 flex flex-col items-center justify-center space-y-3"
            >
              <div className="text-5xl">📄</div>
              <div className="text-center">
                <p className="font-bold text-gray-800 text-lg">Tài Liệu</p>
                <p className="text-sm text-gray-600 underline">Link</p>
              </div>
            </a>

            {/* Github */}
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-2xl p-6 hover:shadow-lg transition-all hover:scale-105 flex flex-col items-center justify-center space-y-3"
            >
              <div className="text-5xl">💻</div>
              <div className="text-center">
                <p className="font-bold text-gray-800 text-lg">Github</p>
                <p className="text-sm text-gray-600 underline">Link</p>
              </div>
            </a>

            {/* Figma */}
            <a
              href={profile.links.figma}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-2xl p-6 hover:shadow-lg transition-all hover:scale-105 flex flex-col items-center justify-center space-y-3"
            >
              <div className="text-5xl">🎨</div>
              <div className="text-center">
                <p className="font-bold text-gray-800 text-lg">Figma</p>
                <p className="text-sm text-gray-600 underline">Link</p>
              </div>
            </a>

            {/* API Docs (Swagger) */}
            <a
              href={profile.links.api || profile.links.postman || profile.links.diagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-2xl p-6 hover:shadow-lg transition-all hover:scale-105 flex flex-col items-center justify-center space-y-3"
            >
              <div className="text-5xl">📘</div>
              <div className="text-center">
                <p className="font-bold text-gray-800 text-lg">API Docs</p>
                <p className="text-sm text-gray-600 underline">Link</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
