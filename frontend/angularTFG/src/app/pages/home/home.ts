import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {


  username: string = 'username';
  
    logout() {
    console.log('Cerrar sesión');
  }
}
