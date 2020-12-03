import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { MsgService } from 'src/services/msg.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  template: `
tipoU  : {{tipoU}}
 
`
})
export class SigninComponent implements OnInit {
  formUsuario: FormGroup;
  urlImg: String;
  fecha: Date;
  @Input() tipoU: string;
  constructor(private db: AngularFirestore, private fb: FormBuilder, private storage: AngularFireStorage, private msg: MsgService, private auth: AngularFireAuth, public authService: AuthService) { }

  ngOnInit(): void {
    this.formUsuario = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      correo: ['', Validators.compose([Validators.email, Validators.required])],
      contraseña: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
      img: [''],
      tipoUsuario: [''],

      uid: ['']
    })
  }
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
          this.urlImg = url;
        })
      })
    }
  }
  addUser() {
    this.formUsuario.value.tipoUsuario = this.tipoU;
    if (this.urlImg != undefined) {
      this.formUsuario.value.img = this.urlImg;
      this.auth.auth.createUserWithEmailAndPassword(this.formUsuario.value.correo, this.formUsuario.value.contraseña).then((data) => {
        this.formUsuario.value.uid = data.user.uid
        this.formUsuario.value.nombre = this.formUsuario.value.nombre + " " + this.formUsuario.value.apellido
        this.db.collection('usuarios').doc(data.user.uid).set(this.formUsuario.value).then((finish) => {
        }).catch(() => {
          this.msg.msgError('Error', 'Algo fallo :(')
        })
      }).then(() => {
        this.msg.msgSuccess('Agregado', 'Usuario agregado correctamente')
      })
    } else {
      this.msg.msgError('Error', 'por favor inserte imagen')
    }
  }
}
