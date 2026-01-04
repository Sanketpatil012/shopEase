import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { NgModel } from '@angular/forms';
@Component({
  selector: 'app-product-details',
  imports: [CommonModule , RouterLink ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent implements OnInit {
  public productId: string | null = null;
  public productArray: any =  null ;
    public quantity: number = 1;
  public activeTab: string = 'description';
  constructor(
    private route: ActivatedRoute,
    private ProductService: ProductService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.loadProductsById(this.productId);
    } else {
      console.log('No Product Found');
    }
  }

  loadProductsById(productId: string) {
    this.ProductService.getProductById(productId).subscribe({
      next: (res: any) => {
        this.productArray = res;
        console.log('Response of the viewProduct', res);
      },
      error: () => {
        console.log('Error while feching the Products ');
      },
    });
  }
   increaseQuantity(): void {
    if (this.productArray && this.quantity < this.productArray.stock) {
      this.quantity++;
    }
  }
  
  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}
