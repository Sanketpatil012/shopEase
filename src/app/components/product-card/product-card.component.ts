import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../type/product';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() showActions: boolean = true;
  @Output() addToCart = new EventEmitter<Product>();
  @Output() addToWishlist = new EventEmitter<Product>();

  onAddToCart(event: Event): void {
    event.stopPropagation();
    this.addToCart.emit(this.product);
  }

  onAddToWishlist(event: Event): void {
    event.stopPropagation();
    this.addToWishlist.emit(this.product);
  }

  calculateDiscountPercentage(): string {
    if (this.product.discount > 0 && this.product.price > 0) {
      return ((this.product.discount / this.product.price) * 100).toFixed(0);
    }
    return '0';
  }

  getFinalPrice(): number {
    return this.product.price - this.product.discount;
  }
}