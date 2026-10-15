// components/product-card/product-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../type/product';
import { OrderService } from '../../services/order.service';

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

  isAddingToCart: boolean = false; // To show loading state

  constructor(private order_service: OrderService) {}

  // This is the main method for Add to Cart button
  onAddToCart(event: Event): void {
    event.stopPropagation();
    this.isAddingToCart = true;
    
    this.order_service.addCart(this.product._id, 1).subscribe({
      next: (response) => {
        console.log('Added to cart:', response);
        this.isAddingToCart = false;
        // You can show a success toast/notification here
        this.showSuccessMessage('Product added to cart successfully!');
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        this.isAddingToCart = false;
        this.showErrorMessage('Failed to add product to cart');
      }
    });
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
    return this.product.price - (this.product.discount || 0);
  }

  private showSuccessMessage(message: string): void {
    // You can implement a toast notification service here
    // For now, using a temporary alert (you can replace with a proper toast)
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slideUp';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  private showErrorMessage(message: string): void {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slideUp';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
}