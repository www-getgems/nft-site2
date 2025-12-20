import React from 'react';

export default function Loading() {
  return (
    <div className="h-screen font-sans flex items-center justify-center bg-gray-800 text-white px-4 text-center transition-all duration-500 ease-in-out">
      <div className="flex flex-col items-center max-w-md w-full">
        
        {/* Спиннер */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mb-8"></div>
    
        {/* Заголовок */}
        <b className="text-2xl font-semibold mb-4 tracking-wide">
          Загрузка...
        </b>
    
        {/* Подзаголовок */}
        <h3 className="text-base text-gray-400 leading-relaxed">
          Пожалуйста, подождите немного.
        </h3>
    
      </div>
    </div>
  );
}
