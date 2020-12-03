import { Component, OnInit } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { MsgService } from 'src/services/msg.service';
import { AngularFireAuth } from '@angular/fire/auth';




@Component({
  // providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService],
  selector: 'app-schedule',
  // template: `<ejs-schedule> </ejs-schedule>`,
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],

})

export class ScheduleComponent implements OnInit {
  displayedColumns: string[] = ['hora', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
  visible = false;
  clunes: Array<any> = new Array();
  cmartes: Array<any> = new Array();
  cmiercoles: Array<any> = new Array();
  cjueves: Array<any> = new Array();
  cviernes: Array<any> = new Array();
  csabado: Array<any> = new Array();
  cdomingo: Array<any> = new Array();
  horas = ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']


  constructor(private db: AngularFirestore, private msg: MsgService, private auth: AngularFireAuth) { }
breakpoint
  ngOnInit(): void {
    this.getData()
    this.breakpoint = (window.innerWidth <= 400) ? 1 : 6;



  }
  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 400) ? 1 : 6;
  }
  //todos los change son para designar si el instructor va a dar en a esa hora

  save() {
    var u = this.auth.auth.currentUser;

    this.db.collection('horario').doc(u.uid).set({

      lunes: this.clunes,
      martes: this.cmartes,
      miercoles: this.cmiercoles,
      jueves: this.cjueves,
      viernes: this.cviernes,
      sabado: this.csabado,
      domingo: this.cdomingo
    }).then(() => {
      //horario:this.dataSource
      this.msg.msgSuccess('Registrado', 'Horario registrado exitosamente');


    }).catch((error) => {
      console.log(error)
      this.msg.msgError('Error', error);
    })
  }
  //a reparar esto, deberia traer la informacion de las asesorias pero llegan en desorden
  getData() {
    this.db.collection('horario').get().subscribe((res) => {
      res.docs.forEach((item) => {
        let h = item.data();

        h.id = item.id
        if (h.id == this.auth.auth.currentUser.uid) {

          this.clunes = h.lunes;

          this.cmartes = h.martes;
          this.cmiercoles = h.miercoles;
          this.cjueves = h.jueves;
          this.cviernes = h.viernes;
          this.csabado = h.sabado;
          this.cdomingo = h.domingo;

        }
      })
    })

  }

  //registra la sesiones que solicita el estudiante

  //Muestra la semana correspondiente
  getWeek() {
    let today = new Date();
    let todayDate = today.getDate();
    let todayMonth = today.getMonth();
    let todayYear = today.getFullYear();
    let weekend = new Date();
    weekend.setDate(todayDate + 6);
    let weekendDate = weekend.getDate();
    let weekendMonth = weekend.getMonth();
    let weekendYear = weekend.getFullYear();

    return ("Semana del " + todayDate + "/" + (todayMonth + 1) + "/" + todayYear + " al " +
      weekendDate + "/" + (weekendMonth + 1) + "/" + weekendYear);
  }
  checkLunes(hour): boolean {

    var exits = false
    this.clunes.forEach(h => {

      if (h == hour) {
        console.log('exite');
        exits = true
      }

    })
    return exits
  }
  checkMartes(hour): boolean {

    var exits = false
    this.cmartes.forEach(h => {

      if (h == hour) {
        console.log('exite');
        exits = true
      }

    })
    return exits
  }
  checkMiercoles(hour): boolean {

    var exits = false
    this.cmiercoles.forEach(h => {

      if (h == hour) {
        console.log('exite');
        exits = true
      }

    })
    return exits
  }
  checkJueves(hour): boolean {

    var exits = false
    this.cjueves.forEach(h => {

      if (h == hour) {
        console.log('exite');
        exits = true
      }

    })
    return exits
  } 
  checkViernes(hour): boolean {

    var exits = false
    this.cviernes.forEach(h => {

      if (h == hour) {
        console.log('exite');
        exits = true
      }

    })
    return exits
  }
  checkSabado(hour): boolean {

    var exits = false
    this.csabado.forEach(h => {

      if (h == hour) {
        console.log('exite');
        exits = true
      }

    })
    return exits
  }
  checkDomingo(hour): boolean {

    var exits = false
    this.cdomingo.forEach(h => {

      if (h == hour) {
        console.log('exite');
        exits = true
      }

    })
    return exits
  }
}