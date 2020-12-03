import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Usuario } from 'src/models/usuario';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  usuario:Usuario
  constructor(private auth:AngularFireAuth, private db:AngularFirestore, private userSer:UserService) { }
  getUsuario(){
    let txt:string=''
   this.db.collection('usuarios').get().subscribe((res)=>{
  res.docs.forEach((item)=>{
      let u=item.data() as Usuario
      if(u.id==this.auth.auth.currentUser.uid){
         
      this.usuario=u;
      console.log(this.usuario)
        }
  
  })
  
   })
  
  }
}
