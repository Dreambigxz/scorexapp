import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header2Component } from "../components/header2/header2.component";

@Component({
  selector: 'app-about-us',
  imports: [
    CommonModule,
    Header2Component
  ],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent {

}
