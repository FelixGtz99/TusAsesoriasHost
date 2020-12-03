import { Injectable } from '@angular/core';
import Swal from 'sweetalert2'
@Injectable({
  providedIn: 'root'
})
export class MsgService {

  constructor() { }
  msgSuccess(title:string, text:string){
 Swal.fire({
   title:title,
   text:text,
   icon:"success"
 })
 
  }
  msgWarning(title:string, text:string){
    Swal.fire({
      title:title,
      text:text,
      icon:"warning"
    })
  }
  msgError(title:string, text:string){
    Swal.fire({
      title:title,
      text:text,
      icon:"error"
    })
  }
}
