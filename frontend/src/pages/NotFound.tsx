import React from 'react';
import pillIconNotFound from "../assets/YakTok_character_notfound.svg";


const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <img
        src={pillIconNotFound}
        alt="Not Found"
        className="w-64 h-auto m-10"
      />
      <p className="text-2xl font-bold" style={{ color: '#333' }}>
        페이지를 찾을 수 없습니 - 톡
      </p>
    </div>
  );
};

export default NotFound;