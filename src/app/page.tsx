'use client';
import Link from "next/link";
import { getApartments, getAllRoom } from "./api/apis";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Apartment {
  rooms: Room[];
  id: number;
  created_at: string;
  name: string;
  location: string;
  price: number;
  description: string;
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

export default function Home() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

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
        const response = await getApartments();
        const apartments = response as Apartment[];
        const roomsResponse = await getAllRoom();
        const rooms = roomsResponse as Room[];
        const apartmentsWithRooms = apartments.map(apartment => ({
          ...apartment,
          rooms: rooms.filter(room => room.aparment_id === apartment.id),
        }));

        setApartments(apartmentsWithRooms);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener apartamentos:', error);
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredApartments = apartments.filter((apartment) => {
    const searchText = searchTerm.toLowerCase();
    return (
      apartment.name.toLowerCase().includes(searchText) ||
      apartment.location.toLowerCase().includes(searchText) ||
      apartment.description.toLowerCase().includes(searchText)
    );
  });
  console.log(filteredApartments);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 container">
      <div className="w-full max-w-md mb-4 flex">
        <input
          type="text"
          className="flex-grow px-4 py-2 border rounded-l-md text-black"
          placeholder="Buscar apartamentos"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Link href="/pages/create-apartament" passHref>
          <button className="ml-0 sm:ml-2 mt-2 sm:mt-0 p-2 bg-blue-500 text-white rounded shadow">
            Crear Apartamentos
          </button>
        </Link>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-500"></div>
          <p className="text-gray-500">Cargando apartamentos</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredApartments.map(apartment => (
            <Link key={apartment.id} href={`/pages/apartment/${apartment.id}`} passHref>
              <div className="w-full max-w-xs bg-white shadow-lg rounded-lg overflow-hidden mb-4">
                {apartment.rooms.length > 0 ? (
                  <Slider {...settings}>
                    {apartment.rooms.map((room) => (
                      <div key={room.id} className="carousel-item">
                        <img
                          className="w-full h-full object-cover"
                          src={room.image_url}
                          alt={room.name}
                        />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <div className="p-4">
                    <p className="text-gray-500">No hay habitaciones disponibles</p>
                  </div>
                )}
                <div className="p-4">
                  <h1 className="text-2xl font-bold mb-2 text-black">{apartment.name}</h1>
                  <p className="text-lg font-bold text-black">${apartment.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}