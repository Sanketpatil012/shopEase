import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../type/product';

@Component({
  selector: 'app-product-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-carousel.component.html',
  styleUrls: ['./product-carousel.component.scss']
})
export class ProductCarouselComponent implements OnInit, OnDestroy {
  @Input() set products(value: Product[]) {
    console.log('Carousel received products:', value?.length || 0);
    this._products = value || [];
    // Reset to first slide when products change
    this.currentSlide = 0;
    this.restartAutoPlay();
  }
  get products(): Product[] {
    return this._products;
  }
  private _products: Product[] = [];

  @Input() autoPlay: boolean = true;
  @Input() interval: number = 5000; // 5 seconds

  currentSlide: number = 0;
  private autoPlayInterval: any;

  ngOnInit(): void {
    console.log('Carousel initialized with products:', this.products.length);
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  nextSlide(): void {
    if (this.products.length <= 1) return;
    
    this.currentSlide = (this.currentSlide + 1) % this.products.length;
    console.log('Next slide:', this.currentSlide);
    this.restartAutoPlay();
  }

  previousSlide(): void {
    if (this.products.length <= 1) return;
    
    this.currentSlide = (this.currentSlide - 1 + this.products.length) % this.products.length;
    console.log('Previous slide:', this.currentSlide);
    this.restartAutoPlay();
  }

  goToSlide(index: number): void {
    if (index >= 0 && index < this.products.length) {
      this.currentSlide = index;
      console.log('Go to slide:', this.currentSlide);
      this.restartAutoPlay();
    }
  }

  private startAutoPlay(): void {
    if (this.autoPlay && this.products.length > 1) {
      console.log('Starting autoplay with interval:', this.interval);
      this.stopAutoPlay(); // Clear any existing interval
      
      this.autoPlayInterval = setInterval(() => {
        this.nextSlide();
      }, this.interval);
    }
  }

  private stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  private restartAutoPlay(): void {
    this.stopAutoPlay();
    this.startAutoPlay();
  }
}