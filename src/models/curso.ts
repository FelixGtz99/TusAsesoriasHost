import { Categoria } from './categoria';
import { Usuario } from './usuario';

export class Curso{
   categoria:Categoria;
   tarifa:number;
   user:Usuario
   id:string
   evaluaciones:any
   nivel:any
   etiquetas:any
   ban:boolean
}