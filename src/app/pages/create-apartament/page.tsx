'use client';

import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { createApartment, createRoom } from '../../api/apis'
import { supabase } from '@/app/config/supabase';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.css';


interface Apartment {
    name: string;
    location: string;
    price: number;
    description: string;
    rooms: Room[];
}

interface Room {
    name: string;
    size: number;
    equipment: string;
    image: string;
}

const CreateApartmentPage: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [apartment, setApartment] = useState<Apartment>({
        name: '',
        location: '',
        price: 0,
        description: '',
        rooms: [],
    });

    const [room, setRoom] = useState({ name: '', size: 0, equipment: '', image: '' });


    const handleApartmentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setApartment({ ...apartment, [e.target.name]: e.target.value });
    };
    const handleRoomChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRoom({ ...room, [e.target.name]: e.target.value });
    };

    const handleAddRoom = () => {
        const newRoom = { ...room };
        if (selectedImage) {
            newRoom.image = URL.createObjectURL(selectedImage);
        }
        setApartment({ ...apartment, rooms: [...apartment.rooms, newRoom] });
        setRoom({ name: '', size: 0, equipment: '', image: '' });
        setSelectedImage(null);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const newApartment = await createApartment(apartment.name, apartment.location, apartment.price, apartment.description);
            for (const room of apartment.rooms) {
                const roomImageBlobUrl = room?.image;
                if (!roomImageBlobUrl) {
                    throw new Error('Invalid room image file');
                }
                // Convert blob URL to File
                const response = await fetch(roomImageBlobUrl);
                const blob = await response.blob();
                const roomImageFile = new File([blob], `room-image-${room.name}.jpg`, { type: blob.type });

                const { data, error } = await supabase.storage
                    .from('test')
                    .upload(`public/${roomImageFile.name}`, roomImageFile);

                if (error || !data || !data.path) {
                    console.error('Error al cargar la imagen:', error);
                    throw new Error('Error al cargar la imagen');
                }
                const roomImageUrl = `https://xorwphhhsljgxitxmyct.supabase.co/storage/v1/object/public/test/${data.path}`;
                await createRoom(room.name, room.size, room.equipment, roomImageUrl, newApartment[0].id);
            }
            toast.success('Operación exitosa');
            window.location.href = '/';
        } catch (error) {
            console.log('Error al crear el apartamento:', error);
            // Show error message
            toast.error('Error al crear el apartamento');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 flex justify-center items-center min-h-screen" style={{ background: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="bg-white p-4 rounded shadow-lg w-full max-w-4xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.09)' }}>
                <Tabs>
                    <TabList className="flex mb-4 justify-center">
                        <Tab className="mr-2 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer transition-colors duration-300 hover:bg-blue-600" style={{ borderBottom: '2px solid #fff' }}>Apartamento</Tab>
                        <Tab className="mr-2 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer transition-colors duration-300 hover:bg-blue-600" style={{ borderBottom: '2px solid #fff' }}>Crear habitacion</Tab>
                    </TabList>

                    <TabPanel>
                        <h1 className="text-2xl font-bold mb-4 text-center">Crear apartamento</h1>
                        <form className="mb-4">
                            <div className="flex flex-col mb-2 justify-center items-center">
                                <label className="mb-1">Nombre:</label>
                                <input type="text" name="name" value={apartment.name} onChange={handleApartmentChange} className="border border-gray-300 rounded px-2 py-1 text-black w-full max-w-md" />
                            </div>
                            <br />
                            <div className="flex flex-col mb-2 justify-center items-center">
                                <label className="mb-1">Ubicacion:</label>
                                <input type="text" name="location" value={apartment.location} onChange={handleApartmentChange} className="border border-gray-300 rounded px-2 py-1 text-black w-full max-w-md" />
                            </div>
                            <br />
                            <div className="flex flex-col mb-2 justify-center items-center">
                                <label className="mb-1">Precio:</label>
                                <input type="number" name="price" value={apartment.price} onChange={handleApartmentChange} className="border border-gray-300 rounded px-2 py-1 text-black w-full max-w-md" />
                            </div>
                            <br />
                            <div className="flex flex-col mb-2 justify-center items-center">
                                <label className="mb-1">Descripcion:</label>
                                <textarea name="description" value={apartment.description} onChange={handleApartmentChange} className="border border-gray-300 rounded px-2 py-1 text-black w-full max-w-md" />
                            </div>
                            <br />
                        </form>
                    </TabPanel>

                    <TabPanel>
                        <h2 className="text-xl font-bold mb-4 text-center">Añadir habitaciones</h2>
                        <form className="mb-4">
                            <div className="flex flex-col mb-2 justify-center items-center">
                                <label className="mb-1">Nombre:</label>
                                <input type="text" name="name" value={room.name} onChange={handleRoomChange} className="border border-gray-300 rounded px-2 py-1 text-black w-full max-w-md" />
                            </div>
                            <br />
                            <div className="flex flex-col mb-2 justify-center items-center">
                                <label className="mb-1">Tamaño:</label>
                                <input type="text" name="size" value={room.size} onChange={handleRoomChange} className="border border-gray-300 rounded px-2 py-1 text-black w-full max-w-md" />
                            </div>
                            <br />
                            <div className="flex flex-col mb-2 justify-center items-center">
                                <label className="mb-1">Equipos:</label>
                                <input type="text" name="equipment" value={room.equipment} onChange={handleRoomChange} className="border border-gray-300 rounded px-2 py-1 text-black w-full max-w-md" />
                            </div>
                            <br />
                            <div className="flex flex-col mb-2 justify-center items-center">
                                <label className="mb-1">Imagen:</label>
                                <input type="file" name="image" onChange={handleImageChange} className="border border-gray-300 rounded px-2 py-1 text-black w-full max-w-md" />
                            </div>
                            <br />
                            <div className="flex flex-col mb-2 justify-center items-center" >
                                <button type="button" onClick={handleAddRoom} className="bg-blue-500 text-white px-4 py-2 rounded transition-colors duration-300 hover:bg-blue-600 ">Añadir</button>
                            </div>

                        </form>
                        <h2 className="text-xl font-bold mb-4 text-center">Habitaciones</h2>
                        <div className="flex flex-wrap justify-center">
                            {apartment.rooms.map((room, index) => (
                                <div key={index} className="mb-4 mr-4 w-full sm:w-1/2 lg:w-1/4">
                                    <h3 className="text-lg font-bold">{room.name}</h3>
                                    <p>Tamaño: {room.size}</p>
                                    <p>Equipos: {room.equipment}</p>
                                    {room.image && (
                                        <img
                                            src={typeof room.image === 'string' ? room.image : URL.createObjectURL(room.image)}
                                            alt={room.name}
                                            className="w-32 h-32 object-cover rounded"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </TabPanel>
                </Tabs>
                {apartment.rooms.length > 0 && (
                    <div className="flex justify-center mt-4">
                        <button onClick={handleSubmit} type="button" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-300">Guardar apartamento</button>
                    </div>
                )}
                {loading && (
                    <div className="flex justify-center mt-4">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                )}
                <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
                    onClick={() => window.history.back()}
                >
                    Volver
                </button>
            </div>
        </div>
    );
};

export default CreateApartmentPage;
