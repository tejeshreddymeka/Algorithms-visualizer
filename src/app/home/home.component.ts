import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { HomeParticle } from '../models/home-particle';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor() { }

  @ViewChild('headerCanvas', {static: false}) headerCanvasRef: ElementRef;
  @ViewChild('headerCanvasWrapper', {static: false}) headerCanvasWrapperRef: ElementRef;
  headerCanvasContext: CanvasRenderingContext2D;
  headerCanvas: HTMLCanvasElement;

  // header canvas animation begins
  particles: HomeParticle[] = [];
  particlesCount: number;
  maxRadius = 8;
  minRadius = 5;
  minDistanceBetweenParticles = 20;

  @HostListener('window:resize', ['$event'])
  onWindowResize(event) {
    this.headerCanvas.width = (this.headerCanvasWrapperRef.nativeElement as Element).clientWidth;
    this.headerCanvas.height = (this.headerCanvasWrapperRef.nativeElement as Element).clientHeight;
    this.adjustHeaderCanvasParams();
    this.initParticles();
    // this.drawHomeCanvas();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.headerCanvas = this.headerCanvasRef.nativeElement;
    this.headerCanvasContext = this.headerCanvas.getContext('2d');
    this.headerCanvas.width = (this.headerCanvasWrapperRef.nativeElement as Element).clientWidth;
    this.headerCanvas.height = (this.headerCanvasWrapperRef.nativeElement as Element).clientHeight;
    this.adjustHeaderCanvasParams();
    this.initParticles();
    // this.drawHomeCanvas();
  }

  adjustHeaderCanvasParams() {
    this.particlesCount = Math.floor(this.headerCanvas.width / 50) * Math.floor(this.headerCanvas.height / 80);
  }
  // colors: string[] = ['red','blue','green','yellow','black','grey']

  initParticles() {
    this.particles = [];
    for (let rep = 1; rep <= this.particlesCount; ++rep) {
      let particle: HomeParticle;
      do {
        particle = {
          radius: Math.floor(Math.random() * (this.maxRadius - this.minRadius + 1) + this.minRadius),
          x: Math.floor(Math.random() * (this.headerCanvas.width - 2 * this.maxRadius)) + this.maxRadius,
          y: Math.floor(Math.random() * (this.headerCanvas.height - 2 * this.maxRadius)) + this.maxRadius,
          color: 'rgba(255,255,255,0.5)',
        };
      }while (this.particles.some(particle1 => this.doesParticlesAreNearby(particle1, particle)));
      this.particles.push(particle);
    }
  }

  doesParticlesAreNearby(particle1: HomeParticle, particle2: HomeParticle): boolean {
    const d =  Math.sqrt( Math.pow(particle1.x - particle2.x, 2) + Math.pow(particle1.y - particle2.y, 2));
    return (d < particle1.radius + particle2.radius + this.minDistanceBetweenParticles ? true : false);
  }

  drawHomeCanvas() {
    this.headerCanvasContext.clearRect(0, 0, this.headerCanvas.width, this.headerCanvas.height);
    this.particles.forEach(particle => {
      this.headerCanvasContext.beginPath();
      this.headerCanvasContext.shadowBlur = 10;
      this.headerCanvasContext.shadowColor = particle.color;
      this.headerCanvasContext.fillStyle = particle.color;
      this.headerCanvasContext.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI);
      this.headerCanvasContext.fill();
      this.headerCanvasContext.closePath();
    });
  }

  // header canvas animation code ends
}
