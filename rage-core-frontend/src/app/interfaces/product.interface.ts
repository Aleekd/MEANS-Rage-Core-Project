export interface Product {
    _id?: string;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    imagen: string;
    tipo: string;
    corte: string;
    talla: string;
    color: string;
    categoria?: string;
}