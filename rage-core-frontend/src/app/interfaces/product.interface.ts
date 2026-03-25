export interface Product {
    _id?: string;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    imagen: string;
    talla: string;
    color: string;
    categoria?: string;
}