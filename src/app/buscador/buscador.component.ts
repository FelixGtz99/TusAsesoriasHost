import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Usuario } from 'src/models/usuario';
import { AngularFirestore } from '@angular/fire/firestore';
import { Curso } from 'src/models/curso';
import { AngularFireAuth } from '@angular/fire/auth';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { inputs } from '@syncfusion/ej2-angular-schedule/src/schedule/schedule.component';
import { createModifiersFromModifierFlags } from 'typescript';
import { FormControl } from '@angular/forms';
import { Categoria } from 'src/models/categoria';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent implements OnInit {
  formBusqueda:FormGroup;
  filter:''
  selected = 'maestro';
  maestro='maestro';
  categoria='categoria';
  instructor = 'instructor'
  alumno = 'alumno'
  administrador = 'administrador'
  
  cursos:Curso[]=new Array<Curso>()
  cursosChecked:Curso[]=new Array<Curso>()
  categorias: Categoria[] = new Array<Categoria>()
  currentRate = 5;
  filtrarCategoria:boolean=false
  allSelected:boolean=false
  isDisabled : boolean;
  checkedItems:string[];
  usuario: Usuario
  isValid: boolean = false
  isCollapsed: boolean = false;
  constructor(private db: AngularFirestore, private fb: FormBuilder,private auth: AngularFireAuth) { }

  ngOnInit(): void {
    this.cursos.length=0;
    this.categorias.length=0;
    this.getCourses()
    this.getCategories()
    this.checkedItems =  new Array<string>();
    this.getUser()
   
  }

  getCategoriesId(e:any, nombre:string) {
console.log(e);

    if(e.target.checked) {
      console.log(nombre + ' Checked');
      this.checkedItems.push(nombre);
    }
    else {
      console.log(nombre + ' UNChecked');
      this.checkedItems =this.checkedItems.filter(m=>m!=nombre);
    }
    console.log(this.checkedItems)
     this.getCursosMatched()
     console.log(this.cursosChecked);
     
  }

   getCursosMatched(){
     this.cursosChecked.length=0
   this.cursos.forEach((curso)=>{
          this.checkedItems.forEach((checked)=>{
            if(curso.categoria.nombre==checked){
              console.log(2);
              if(curso.ban!=true){
                this.cursosChecked.push(curso);
              }
            
             }

          })
   })
  }
getAll(){
  if(!this.allSelected){
    this.cursos.forEach((item)=>{
      this.cursosChecked.push(item)
    })

  }else{
    this.getCursosMatched()
  }
this.allSelected=!this.allSelected

  
}
  getCategories() {
    this.db.collection('categorias').get().subscribe((res) => {
      res.docs.forEach((item) => {
        let c = item.data() as Categoria
        c.id = item.id;
        this.categorias.push(c) 
      })

    })
  }

  

  ///Obtiene todos los cursos con su promedio de evaluacion
  getCourses(){
  
    this.db.collection('cursos').get().subscribe((res)=>{
      res.docs.forEach((item)=>{
        let c= item.data() as Curso;
        c.id=item.id
        this.db.collection('evaluaciones').get().subscribe((res2)=>{
          var e=new Array<any>();
          var E:any=0
          res2.docs.forEach((item2)=>{

             if(item2.id.split('@')[1]==c.id){
               e.push(item2.data().calificacion)
               E=E+item2.data().calificacion
             }
          })
          c.evaluaciones=E/e.length;
          if (c.ban!=true){
            this.cursos.push(c);
            this.cursosChecked.push(c)

          }
         
        })
      })
    })

  }
  
  getUser() {
    this.db.collection('usuarios').get().subscribe((res) => {
      res.docs.forEach((item) => {
        let u = item.data() as Usuario
        if (u.uid == this.auth.auth.currentUser.uid) {
          this.usuario = u;
          this.isValid = true
          console.log(this.isValid)
        } else {
          console.log("no existe");
        }
      })
    })
  }
}
