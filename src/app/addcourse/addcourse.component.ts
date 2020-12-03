import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { MsgService } from 'src/services/msg.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Usuario } from 'src/models/usuario';
import { ActivatedRoute } from '@angular/router';
import { Categoria } from 'src/models/categoria';
import { Nivel } from 'src/models/nivel';
import { COMMA} from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatChipList } from '@angular/material/chips';
@Component({
  selector: 'app-addcourse',
  templateUrl: './addcourse.component.html',
  styleUrls: ['./addcourse.component.css']
})
export class AddcourseComponent implements OnInit {
  categoria: Categoria
  categorias: Array<Categoria> = new Array()
  categoriasUsadas: Array<Categoria> = new Array()
  nivel: Nivel
  niveles: Array<Nivel> = new Array()
  formCursos: FormGroup
  usuario: Usuario
  readonly separatorKeysCodes: number[] = [COMMA];
  etiquetas: String[] = [];
  disabled: boolean;
  @ViewChild('chipList') chipList: MatChipList;
  constructor(private db: AngularFirestore, private fb: FormBuilder, private storage: AngularFireStorage, private msg: MsgService, private auth: AngularFireAuth, private activeRoute: ActivatedRoute) { }
  
  ngOnInit(): void {
    this.formCursos = this.fb.group({
      tarifa: ['', Validators.required],
      categoria: ['', Validators.required],
      nivel: ['', Validators.required],
      etiquetas: this.fb.array(this.etiquetas,this.validateArrayNotEmpty)
    })

    this.formCursos.get('etiquetas').statusChanges.subscribe(
      status => this.chipList.errorState = status === 'INVALID'
    );
    this.getUser()
    this.getMyCategories()
    this.getCategories()
    this.getNiveles()
  }
  //Este método es para obtener el nombre del formcontrol, necesario para validar
  initName(name: string): FormControl {
    return this.fb.control(name);
  }
  //método para validar que matchiplist no esté vacio
  validateArrayNotEmpty(c: FormControl) {
    if(c.value && c.value.length === 0) {
      return {
        validateArrayNotEmpty: { valid: false }
      };
    }
    return null;
  }

  //Obtiene el usuario 
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

//Obtiene el total de categorias suprimiendo las que ya tiene curso
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

//Obtiene los niveles academicos 
  getNiveles() {
    this.db.collection('niveles').get().subscribe((res) => {
      res.docs.forEach((item) => {
        let n = item.data() as Nivel
        n.id = item.id;
        this.niveles.push(n);
      })
      this.niveles.sort((a,b)=>(a.orden >b.orden)? 1:-1)

    })
  }

  //Agrega el curso en la base de datos
 setCourse() {
    this.formCursos.value.user = this.usuario;
    if (this.formCursos.value.tarifa <= 2000) {
      this.db.collection('cursos').add(this.formCursos.value).then(() => {
        this.msg.msgSuccess('Guardado', 'Curso guardado correctamente')
      })
    } else {
      this.msg.msgError('Error', 'la tarifa maxima es 2000')

    }
  }
//Obtiene las categorias en las que el Instructor tiene curso
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

  //añade etiquetas a la lista
  addTag(event: MatChipInputEvent, form: FormGroup): void {
    const input = event.input;
    const value = event.value;
     
    //Añade la etiqueta
      
      if((value||'').trim()) {
        this.etiquetas.push(value.trim());
        const control = <FormArray>form.get('etiquetas');
        control.push(this.initName(value.trim()));
      }
  
    //Reinicia el input
      if(input){
        input.value='';  
      }

      if(this.etiquetas.length>=5){
        this.disabled = true;
        this.msg.msgSuccess('Límite de etiquetas', 'Ya has insertado cinco etiquetas, si quieres insertar otra debes remover alguna antes.')
      }
    

  }

  //Remueve etiquetas de la ista
  removeTag(tag: String, form): void {
    const index = this.etiquetas.indexOf(tag);
    
    if(index>=0){
      this.etiquetas.splice(index,1);
      form.get('etiquetas').removeAt(index);
    }
    if(this.etiquetas.length<5){
      this.disabled=false;
    }
  }

}
