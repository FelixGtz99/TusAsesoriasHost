import { Injectable } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { Usuario } from 'src/models/usuario';
import { AngularFirestore } from '@angular/fire/firestore';
import { MsgService } from './msg.service';
import { FormBuilder, FormGroup } from '@angular/forms';
@Injectable({
  providedIn: 'root'
})

export class AuthService {
usuario:Usuario=new Usuario;
formUsuario:FormGroup;
isValid:boolean=false
  constructor(
    public afAuth: AngularFireAuth, private db: AngularFirestore, private msg: MsgService, private fb:FormBuilder
  ) { }

  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }  
GoogleRegister(tipoU:string){
  this.formUsuario=this.fb.group({
    nombre: [''],
    apellido: [''],
    fechaNacimiento: [''],
    correo: [''],
    img: [''],
    tipoUsuario: [''],
    
    uid: ['']
  })
  return this.AuthRegister(new auth.GoogleAuthProvider(), tipoU);
}
AuthRegister(provider,tipoU){
 
  return this.afAuth.auth.signInWithPopup(provider)
  
  .then((result) => {
    this.formUsuario.value.tipoUsuario=tipoU
    this.formUsuario.value.uid=result.user.uid;
    this.formUsuario.value.nombre=result.user.displayName;
    this.formUsuario.value.img=result.user.photoURL;
    this.formUsuario.value.correo=result.user.email;
    
    console.log(this.usuario)
    this.db.collection('usuarios').doc(this.formUsuario.value.uid).set(this.formUsuario.value).then((finish) => {

    }).catch(() => {
      this.msg.msgError('Error', 'Algo fallo :(')
    })
  }).then(() => {
    this.msg.msgSuccess('Agregado', 'Usuario agregado correctamente')
  })
      
}


  AuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
    .then((result) => {
      this.getUsuario() 
  
    
        console.log('You have been successfully logged in!')
    }).catch((error) => {
        console.log(error)
    })
  }
 getUsuario(){
    let txt:string=''
    
   this.db.collection('usuarios').get().subscribe((res)=>{
   
  res.docs.forEach((item)=>{
      let u=item.data() as Usuario
      if(u.uid==this.afAuth.auth.currentUser.uid){
       this.isValid=true
        }else{
          console.log("no existe");
          
        }
  
  })
  
   })
  
  }
 
}