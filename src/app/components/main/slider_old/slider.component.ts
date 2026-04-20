import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AfterViewInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-slider',
  imports: [CommonModule, IonicModule],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css'
})
export class SliderComponent {

  items = [
    // { image: "assets/images/sliders/1.jpeg" },
    { image: "assets/images/sliders/5.png" },
    { image: "assets/images/sliders/6.png" },
    { image: "assets/images/sliders/4.jpeg" }
  ];

  @ViewChild('track') track!: ElementRef;

  ngAfterViewInit() {
    const el = this.track.nativeElement;

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    el.addEventListener('mousedown', (e: any) => {
      isDown = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    });

    el.addEventListener('mouseleave', () => isDown = false);
    el.addEventListener('mouseup', () => isDown = false);

    el.addEventListener('mousemove', (e: any) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - startX) * 2;
      el.scrollLeft = scrollLeft - walk;
    });
  }

}
