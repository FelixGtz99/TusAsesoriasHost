import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { MsgService } from 'src/services/msg.service';
@Component({
  selector: 'app-calificar',
  templateUrl: './calificar.component.html',
  styleUrls: ['./calificar.component.css']
})
export class CalificarComponent implements OnInit {
currentRate = 0;
adjetivos:Array<string>=new Array();
  constructor(private db:AngularFirestore,private activedroute: ActivatedRoute, private msg:MsgService) { }
 
  ngOnInit(): void {
    
  }
  //Guarda datos de la evaluacion con la id de asesoria(ida)
   saveEvaluacion(){
     var idM= this.activedroute.snapshot.params.idMaestro
     var idA=this.activedroute.snapshot.params.idAsesoria;

     this.db.collection('evaluaciones').doc(idA).set({
     maestro:idM,
      calificacion:this.currentRate,
      adjetivos:this.adjetivos

     }).finally(()=>{
             this.msg.msgSuccess('Exito','Evaluacion guardada correctamente')
      
     }).catch((err)=>{
       console.log(err)
              this.msg.msgError('Error','Algo salio mal')

       
     })
   } 
   //añade a arreglo con cada uno de los adjetivos 
   saveAdjetivo(value){
      // document.getElementById("myBtn").disabled = true;
    //(this).toggleClass('active');
     if(this.adjetivos.length<3){
     this.adjetivos.push(value);
          //Falta poner que se desactive el boton(o que cambie) xd
     }else{
  this.msg.msgWarning('Alerta','ya elegiste 3 adjetivos')
     }
 
   }
}

