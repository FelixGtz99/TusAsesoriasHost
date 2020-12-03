import { Component, OnInit } from '@angular/core';
import { ZoomMtg } from '@zoomus/websdk';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Usuario } from 'src/models/usuario';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();
@Component({
  selector: 'app-zoom',
  templateUrl: './zoom.component.html',
  styleUrls: ['./zoom.component.css']
})
export class ZoomComponent implements OnInit {
  idMaestro = ''
  idAsesoria = ''
  usuario: Usuario
  isVisible_I: boolean = false;
  isVisible_A: boolean = false
  signatureEndpoint = ''
  apiKey = 'yQ1Gh1u9TyKuOLnEGsAuVA'
  meetingNumber = 0
  role = 0
  userName = ' Felix'
  userEmail = ''
  passWord = '0'
  signature = ''
  apiSecret = 'nuFEHOHIXutpAGbgsJl17IyA3UWvpbRtq3rx'
  formDatos: FormGroup
  constructor(private auth: AngularFireAuth, private db: AngularFirestore, private fb: FormBuilder) {

  }

  ngOnInit() {
    this.getUsuario()
    this.getAsesoriasI();
    this.getAsesoriasA();
    this.formDatos = this.fb.group({
      numero: ['', Validators.compose([Validators.minLength(11), Validators.required])],
      contraseña: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    })
  }
//Obtiene la firma para poder realizar la llamada
  getSignature() {


    this.meetingNumber = this.formDatos.value.numero
    this.passWord = this.formDatos.value.contraseña
    this.signature = ZoomMtg.generateSignature({
      meetingNumber: this.meetingNumber,
      apiKey: this.apiKey,
      apiSecret: this.apiSecret,
      role: this.role,
      success: (res) => {

        console.log(this.signature)

      }
    })
    this.startMeeting(this.signature)
  }
//inicia la llamada
  startMeeting(signature) {

    document.getElementById('zmmtg-root').style.display = 'block'

    ZoomMtg.init({
      //Aqui se pueden poner diversas propiedades  
      //debug: true, //optional
    // leaveUrl: 'http://www.zoom.us', //required
    // webEndpoint: 'PSO web domain', // PSO option
    // showMeetingHeader: false, //option
    // disableInvite: false, //optional
    // disableCallOut: false, //optional
    // disableRecord: false, //optional
    // disableJoinAudio: false, //optional
    // audioPanelAlwaysOpen: true, //optional
    // showPureSharingContent: false, //optional
    // isSupportAV: true, //optional,
    // isSupportChat: true, //optional,
    // isSupportQA: true, //optional,
    // isSupportCC: true, //optional,
    // screenShare: true, //optional,
    // rwcBackup: '', //optional,
    // videoDrag: true, //optional,
    // sharingMode: 'both', //optional,
    // videoHeader: true, //optional,
    // isLockBottom: true, // optional,
    // isSupportNonverbal: true, // optional,
    // isShowJoiningErrorDialog: true, // optional,
    // inviteUrlFormat: '', // optional
    // loginWindow: {  // optional,
    //   width: 400,
    //   height: 380
    // },
    // meetingInfo: [ // optional
    //   'topic',
    //   'host',
    //   'mn',
    //   'pwd',
    //   'telPwd',
    //   'invite',
    //   'participant',
    //   'dc'
    // ],
    // disableVoIP: false, // optional
    // disableReport: false, // optional
    // });
      leaveUrl: "http://localhost:4200/calificar/" + this.idMaestro + "/" + this.idAsesoria,
      isSupportAV: true,
      success: (success) => {
        console.log(success)

        ZoomMtg.join({
          signature: signature,
          meetingNumber: this.meetingNumber,
          userName: this.usuario.nombre,
          apiKey: this.apiKey,
          userEmail: this.userEmail,
          passWord: this.passWord,

          success: (success) => {
            console.log(success)
          },
          error: (error) => {
            console.log(error)
          }
        })

      },
      error: (error) => {
        console.log(error)
      }
    })
  }
  getUsuario() {
    let txt: string = ''
    this.db.collection('usuarios').get().subscribe((res) => {
      res.docs.forEach((item) => {
        let u = item.data() as Usuario
        if (u.uid == this.auth.auth.currentUser.uid) {

          this.usuario = u;
          this.userName = u.nombre;
          console.log(this.usuario)
        }

      })

    })

  }
  //Valida que el alumno tenga clase en la hora en la que entre a la plataforma
  getAsesoriasA() {
    var ida;
    this.db.collection('asesorias').get().subscribe((res) => {
      res.docs.forEach((item) => {
        var uid = this.auth.auth.currentUser.uid;
        var Auid = item.id.split('@', 1)
        ida = item.id
        console.log("id asesoria" + item.id)
        if (uid == Auid.toString()) {
          this.idAsesoria = ida
          this.db.collection('cursos').doc(item.id.split('@')[1]).get().forEach((item3) => {
            this.idMaestro = item3.data().user.uid
          })
          item.data().dias.forEach(element => {
            console.log(item.data().dias[0])
            var fecha = new Date(element.fecha.seconds * 1000);
            var fechaactual = new Date();

            if (fecha.getDate() == fechaactual.getDate() && fecha.getMonth() == fechaactual.getMonth() && fechaactual.getHours() == element.hora.split(':', 1).toString()) {
              this.isVisible_A = true;
              console.log('simon')
            }
          });

        }
      })
    })

  }
   //Valida que el instructor tenga clase en la hora en la que entre a la plataforma
  getAsesoriasI() {
    this.db.collection('asesorias').get().subscribe((res) => {
      res.docs.forEach((item) => {
        var uid = this.auth.auth.currentUser.uid;
        var cid = item.id.split('@')
        var Uid;
        this.db.collection('cursos').get().subscribe((res2) => {
          res2.docs.forEach((item2) => {
            if (item2.id == cid[1]) {
              Uid = item2.data().user.uid;
              this.idMaestro = Uid
              if (uid == Uid) {
                item.data().dias.forEach(element => {
                  var fecha = new Date(element.fecha.seconds * 1000);
                  var fechaactual = new Date();
                  if (fecha.getDate() == fechaactual.getDate() && fecha.getMonth() == fechaactual.getMonth() && fechaactual.getHours() == element.hora.split(':', 1).toString()) {
                    this.isVisible_I = true;
                  }
                });
              }
            }
          })
        })
      })
    })
  }
}
