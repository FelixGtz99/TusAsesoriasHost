import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { MsgService } from 'src/services/msg.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Usuario } from 'src/models/usuario';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edituser',
  templateUrl: './edituser.component.html',
  styleUrls: ['./edituser.component.css']
})
export class EdituserComponent implements OnInit {
  formUsuario: FormGroup
  urlImg: string
  usuario: Usuario
  idUsuario: string
  editCorreo: boolean = false
  editContra: boolean = false
  editImg: boolean = false
  editProfile: boolean = false
  editBiog: boolean = true
  normal: 'normal'
  tipoCorreo: string
  constructor(private db: AngularFirestore, private fb: FormBuilder, private storage: AngularFireStorage, private msg: MsgService, private auth: AngularFireAuth, private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.idUsuario = this.auth.auth.currentUser.uid
    this.getUser();
    this.formUsuario = this.fb.group({
      correo: ['', Validators.email],
      contraseña: ['', Validators.minLength(8)],
      img: [''],
      bio: ['']
    })

  }
  //Añade Imagen a Firestore
  addImg(event) {
    if (event.target.files.length > 0) {
      let name = new Date().getTime().toString()
      let file = event.target.files[0]
      let type = file.name.toString().substring(file.name.toString().lastIndexOf('.'))
      let imgpath = 'usuarios/' + name + type;
      const ref = this.storage.ref(imgpath);
      const task = ref.put(file)
      task.then((obj) => {
        ref.getDownloadURL().subscribe((url) => {
          this.usuario.img = url;
        })
      })
    }
  }
  //Actualiza el email tanto de Autenticacioon como de la base de datos
  editEmail() {
    var user = this.auth.auth.currentUser;

    user.updateEmail(this.formUsuario.value.correo).then(() => {
      this.db.collection('usuarios').doc(user.uid).update({
        correo: this.formUsuario.value.correo
      })
    }).then(() => {
      this.msg.msgSuccess('Correo', 'Correo editado Satisfactoriamente')
    }).catch((err) => {

      this.msg.msgError('Error', err)
    })
  }
  //Actualiza la contraseeña tanto de Autenticacioon como de la base de datos
  editPass() {
    var user = this.auth.auth.currentUser;

    user.updatePassword(this.formUsuario.value.contraseña).then(() => {
      this.db.collection('usuarios').doc(user.uid).update({
        contraseña: this.formUsuario.value.contraseña
      })
    }).then(() => {
      this.msg.msgSuccess('Contraseña', 'Contraseña cambiada Satisfactoriamente')
    }).catch((err) => {

      this.msg.msgError('Error', err)
    })
  }
  //Actualiza la imagen  de la base de datos
  editImgs() {
    var user = this.auth.auth.currentUser;

    this.db.collection('usuarios').doc(user.uid).update({
      img: this.usuario.img

    }).then(() => {
      this.msg.msgSuccess('Imagen', 'Imagen cambiada Satisfactoriamente')
    }).catch((err) => {

      this.msg.msgError('Error', err)
    })
  }
  //Actualiza Bio
  editBio() {
    var user = this.auth.auth.currentUser.uid
    this.db.collection('usuarios').doc(user).update({
      bio: this.formUsuario.value.bio
    }
    ).then(() => {
      this.msg.msgSuccess('Exito', 'Biografia actualizada correctamente')
    }).catch((err) => {
      console.log(err);


    })

  }
  //Se encarga de ver que cambio se van a realizar y llama a los metodos correspondientes
  editUser() {
    if (this.editImg) {
      this.editImgs()
    }
    if (this.editCorreo) {

      this.editEmail()
    }
    if (this.editContra) {

      this.editPass()
    }
    if (this.editBiog) {
      this.editBio()
    }
  }
  //Obtiene el usuario
  getUser() {
    this.db.collection('usuarios').get().subscribe((res) => {
      res.docs.forEach((item) => {
        let u = item.data() as Usuario;
        if (u.uid == this.idUsuario) {
          u.uid = item.id;
          u.ref = item.ref;
          this.usuario = u;
          console.log(this.usuario.img)
          this.tipoCorreo = u.correo.split('@')[1]
          console.log(this.tipoCorreo);

          this.formUsuario.get('bio').setValue(this.usuario.bio)
        }
      })
    })

  }

}