'use client';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getApartment, getRoom } from '../../../api/apis';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Slider from "react-slick";

interface Apartment {
  id: number;
  created_at: string;
  name: string;
  location: string;
  price: number;
  description: string;
  rooms: Room[];
}

interface Room {
  id: number;
  created_at: string;
  name: string;
  size: number;
  equipment: string;
  image_url: string;
  aparment_id: number;
}

export default function ApartmentPage({ params }: { params: { id: string } }) {
  const [apartments, setApartments] = useState<Apartment[] | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const response = await getApartment(params.id);
        const apartments = response as Apartment[];
        const res = await getRoom(params.id);
        const rooms = res as Room[];
        const apartmentsWithRooms = apartments.map(apartment => ({
          ...apartment,
          rooms: rooms.filter(room => room.aparment_id === apartment.id),
        }));

        setApartments(apartmentsWithRooms);
        setIsLoading(false);
      } catch (error) {
        console.error('Error al obtener apartamentos:', error);
        setIsLoading(false);
      }
    };

    fetchApartments();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-blue-500">Cargando apartamento</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {apartments && apartments.map((apartment) => (
            <div key={apartment.id} className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden mb-4">
              {apartment.rooms?.length > 1 ? (
                <Slider {...settings}>
                  {apartment.rooms.map((room) => (
                    <div key={room.id} className="carousel-item">
                      <img
                        className="w-full h-64 object-cover"
                        src={room.image_url}
                        alt={room.name}
                      />
                    </div>
                  ))}
                </Slider>
              ) : apartment.rooms?.length === 1 ? (
                <div className="carousel-item">
                  <img
                    className="w-full h-64 object-cover"
                    src={apartment.rooms[0].image_url}
                    alt={apartment.rooms[0].name}
                  />
                </div>
              ) : (
                <div className="p-4">
                  <p className="text-gray-500">No hay habitaciones disponibles</p>
                </div>
              )}
              <div className="p-4">
                <h1 className="text-2xl font-bold mb-2 text-black">{apartment.name}</h1>
                <p className="text-gray-600 mb-4 text-black">{apartment.description}</p>
                <p className="text-lg font-bold text-black">${apartment.price}</p>
                <Link
                  className="text-white bg-blue-500 rounded-lg px-4 py-2 mt-4 inline-block"
                  href={`/pages/room/${apartment.id}`}
                >
                  Ver habitaciones
                </Link>
              </div>
            </div>
          ))}
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={() => window.history.back()}
          >
            Volver
          </button>
          {!apartments && (
            <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
              <div className="w-full h-64 bg-gray-200"></div>
              <div className="p-4">
                <h1 className="text-2xl font-bold mb-2 text-black">No se encontró el apartamento</h1>
                <p className="text-gray-600 mb-4 text-black">El apartamento que estás buscando no existe.</p>
                <Link
                  className="text-white bg-blue-500 rounded-lg px-4 py-2 mt-4 inline-block"
                  href="/"
                >
                  Volver a la página principal
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}