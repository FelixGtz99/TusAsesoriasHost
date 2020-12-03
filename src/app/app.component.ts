import { Component,OnInit } from '@angular/core';
import { AngularFireAuth} from '@angular/fire/auth'
import { User } from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
import { Usuario } from 'src/models/usuario';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'TusAsesorias';
  alumno='alumno';
  instructor='instructor'
  administrador = 'administrador'
  user:User
  usuario:Usuario
  url: string
constructor(private auth:AngularFireAuth, private db:AngularFirestore, private router:Router){
  this.auth.user.subscribe((user)=>{
    this.user=user;
    this.url = this.router.url;
    router.events.subscribe((val) => {
      this.url = this.router.url;
    });
  })
}
ngOnInit(): void {

    }

}
