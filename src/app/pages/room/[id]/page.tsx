'use client';

import { useState, useEffect } from 'react';
import { getRoom } from '../../../api/apis';

interface Room {
  id: number;
  created_at: string;
  name: string;
  size: string;
  price: number;
  equipment: string;
  image_url: string;
}

export default function RoomPage({ params }: { params: { id: string } }) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      setIsLoading(true);
      try {
        const response = await getRoom(params.id);
        if (Array.isArray(response)) {
          setRooms(response);
        } else {
          setRooms([]);
        }
        console.log(response);
      } catch (error) {
        console.error('Error al obtener las habitaciones:', error);
        setRooms([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, [params.id]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-500"></div>
          <p className="text-gray-500">Cargando habitaciones</p>
        </div>
      ) : rooms.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-lg shadow-lg p-4">
              <img src={room.image_url} alt={room.name} className="w-full h-40 object-cover mt-2" />
              <h2 className="text-black text-lg font-bold mb-2">Nombre:{room.name}</h2>
              <p className="text-black">Equipos:{room.equipment}</p>
              <p className="text-black">Tamaño:{room.size}</p>
            </div>
          ))}
        </div>

      ) : (
        <p>No se encontraron habitaciones</p>
      )}
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        onClick={() => window.history.back()}
      >
        Volver
      </button>
    </div>
  );
}