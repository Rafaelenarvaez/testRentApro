import { supabase } from "../config/supabase";

export async function createApartment(name: string, location: string, price: number, description: string) {
  const { data, error } = await supabase
    .from('apartments')
    .insert([
      { name, location, price, description },
    ])
    .select();

  if (error) {
    console.error('Error al crear el apartamento:', error);
    throw new Error('Error al crear el apartamento');
  }

  return data;
}


export async function createRoom(name: string, size: number, equipment: string, image: string, aparment_id: number) {
  console.log(name, size, equipment, image, aparment_id)
  const { data, error } = await supabase
    .from('rooms')
    .insert([
      { name: name, size: size, equipment: equipment, image_url: image, aparment_id: aparment_id },
    ])
    .select()

  if (error) {
    console.error('Error al crear la habitacion:', error);
    throw new Error('Error al crear la habitacion');
  }

  return data;
}

export async function getApartments() {
  let { data: apartments, error } = await supabase
    .from('apartments')
    .select('*')
  if (error) {
    console.log('Error al obtener los apartamentos', error)
    throw new Error('Error al obtener los apartamentos')
  }
  return apartments
}

export async function getRoom(id: string) {
  let { data: room, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('aparment_id', id)
  if (error) {
    console.log('Error al obtener la habitacion', error)
    throw new Error('Error al obtener la habitacion')
  }
  return room
}

export async function getAllRoom() {
  let { data: rooms, error } = await supabase
    .from('rooms')
    .select('*')
  if (error) {
    console.log('Error al obtener las habitaciones', error)
    throw new Error('Error al obtener los habitaciones ')
  }
  return rooms
}

export async function getApartment(id: string) {
  let { data, error } = await supabase
    .from('apartments')
    .select('*')
    .eq('id', id)
  if (error) {
    console.log('Error al obtener el apartamento', error)
    throw new Error('Error al obtener el apartamento')
  }
  return data
}

export async function uploadImage(file: File): Promise<string> {
  const { data, error } = await supabase.storage
    .from('test') // Asegúrate de que este sea el nombre correcto del bucket
    .upload(`public/${file.name}`, file);

  if (error) {
    console.error('Error al cargar la imagen:', error);
    throw new Error('Error al cargar la imagen');
  }

  // Devuelve la URL completa de la imagen cargada
  const imageUrl = `https://xorwphhhsljgxitxmyct.supabase.co/storage/v1/object/public/test/${data.path}`;
  return imageUrl;
}
