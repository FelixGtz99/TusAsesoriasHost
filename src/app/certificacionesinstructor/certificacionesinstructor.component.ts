import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { MsgService } from 'src/services/msg.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { Categoria } from 'src/models/categoria';
import { Usuario } from 'src/models/usuario';
import { AngularFireStorage } from '@angular/fire/storage';
import { Certificacion } from 'src/models/certificacion';
@Component({
  selector: 'app-certificacionesinstructor',
  templateUrl: './certificacionesinstructor.component.html',
  styleUrls: ['./certificacionesinstructor.component.css']
})
export class CertificacionesinstructorComponent implements OnInit {
  breakpoint
  certificaciones: Array<Certificacion> = new Array();
  constructor(public dialog: MatDialog, private db: AngularFirestore, private auth: AngularFireAuth) { }

  ngOnInit(): void {
    this.getCertificados()
    this.breakpoint = (window.innerWidth <= 400) ? 1 : 6;
  }

  openDialog(): void {

    const dialogRef = this.dialog.open(dialogNewcertificacion, {
      width: '600px',
      height: '500px',
    });
  }
  openFeedb(txt): void {

    const dialogRef = this.dialog.open(feedbackInstructor, {
      width: '600px',
      height: '500px',
      data:txt
    });
  }
  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 400) ? 1 : 6;
  }
  getCertificados() {
    this.db.collection('certificados').get().subscribe((res) => {
      res.docs.forEach((item) => {
        let c = item.data() as Certificacion;
        c.id = item.id
        if (c.user.uid == this.auth.auth.currentUser.uid) {
          this.certificaciones.push(c)

        }
      })
    })
  }
}
@Component({
  selector: 'dialogNewcertificacion',
  templateUrl: 'dialogNewcertificacion.html',
  styleUrls: ['./dialogNewcertificacion.css'],
})
export class dialogNewcertificacion implements OnInit {
  /**/
  categoria: Categoria
  categorias: Array<Categoria> = new Array()
  categoriasUsadas: Array<Categoria> = new Array()
  usuario: Usuario
  formCertificacion: FormGroup

  constructor(public dialogRef: MatDialogRef<dialogNewcertificacion>,
    @Inject(MAT_DIALOG_DATA) public data: any, private db: AngularFirestore, private msg: MsgService, private storage: AngularFireStorage, private auth: AngularFireAuth, private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
   

    this.getUser()
    this.getCategories()
    this.getMyCategories()
    this.formCertificacion = this.fb.group({
      descripcion: [''],
      categoria: [''],
      docref: ['', Validators.required],
      user: [''],
      status: ['']
    })


    /** */

  }
  addDoc(event) {
    if (event.target.files.length > 0) {
      let name = new Date().getTime().toString()
      let file = event.target.files[0]
      let type = file.name.toString().substring(file.name.toString().lastIndexOf('.'))
      let imgpath = 'certificaciones/' + name + type;
      const ref = this.storage.ref(imgpath);
      const task = ref.put(file)
      task.then((obj) => {
        ref.getDownloadURL().subscribe((url) => {
          this.formCertificacion.value.docref = url;
        })
      })
    }
  }
  save() {
    this.formCertificacion.value.status = "pendiente"
    this.formCertificacion.value.user = this.usuario
    this.db.collection('certificados').add(this.formCertificacion.value).finally(() => {
      this.msg.msgSuccess('Exito', 'Certificado agregado correctamente')
      window.location.reload();
    }).catch((err) => {

      console.log(err);

    })
    /**/
  }

  getUser() {
    this.db.collection('usuarios').get().subscribe((res) => {
      res.docs.forEach((item) => {
        let u = item.data() as Usuario
        if (u.uid == this.auth.auth.currentUser.uid) {
          this.usuario = u;
        }
      })
    })
  }
  getCategories() {
    this.db.collection('categorias').get().subscribe((res) => {
      res.docs.forEach((item) => {
        let c = item.data() as Categoria
        c.id = item.id;
        this.categorias.push(c)
        for (let iten of this.categoriasUsadas) {
          if (c.nombre == iten.nombre) {
            this.categorias.pop();
          }
        }
      })

    })
  }
 
  getMyCategories() {
    this.db.collection('cursos').get().subscribe((res) => {
      res.docs.forEach((item) => {
        let h = item.data();
        if (h.user.uid == this.usuario.uid) {
          this.categoriasUsadas.push(h.categoria);
          console.log("cat usada " + h.categoria.nombre);
        }
      })
    })
  }
  cambiar() {
    var pdrs = document.getElementById('file-upload').localName;
    document.getElementById('info').innerHTML = pdrs;
  }
}
@Component({
  selector: 'feedbackInstuctor',
  templateUrl: 'feedbackInstructor.html',

})
export class feedbackInstructor implements OnInit {


  constructor(
    public dialogRef: MatDialogRef<feedbackInstructor>,
    @Inject(MAT_DIALOG_DATA) public data: any, private db: AngularFirestore, private msg: MsgService, private fb: FormBuilder,) { }
  ngOnInit(): void {


  }

 
  

}
