import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../../type/product';
import { CustomerService } from '../../services/customer.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { HeaderComponent } from "../header/header.component"; // Add this import
import { ProductService } from '../../services/product.service';
import { debounceTime} from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, ProductCardComponent], 
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
}) 
export class HomeComponent implements OnInit, OnDestroy {
  newProduct: Product[] = [];
  copyNewProduct: string = '';
  featuredProduct: Product[] = [];
  copyFeaturedProduct: string = '';
  isSearch:boolean = false;

  carouselItems: { image: string; productId: number }[] = [];
  currentSlide = 0;
  private carouselInterval: any;

  constructor(private customerService: CustomerService,private productService:ProductService) {}

  ngOnInit(): void {
    this.loadNewProducts();
    this.loadFeaturedProducts();
    this.productService.searchTerm
      .pipe(debounceTime(500))
      .subscribe((value) => {
        if (!value || value === '') {
          this.isSearch = false;
          this.newProduct = JSON.parse(this.copyNewProduct);
          this.featuredProduct = JSON.parse(this.copyFeaturedProduct);
        } else {
          this.isSearch = true; 
          const filterProducts = (cloneProduct: any) => {
            const cloneProductArray = JSON.parse(cloneProduct);
            return cloneProductArray.filter((filter: any) => {
              const tempObj = [
                filter.name,
                filter.shortDescription,
                filter.price,
                filter.actualPrice
              ];
              return tempObj
                .toString()
                .toLowerCase()
                .trim()
                .includes(value.toLowerCase().trim());
            });
          };

          this.newProduct = filterProducts(this.copyNewProduct);
          this.featuredProduct = filterProducts(this.copyFeaturedProduct);
        }
      });
  }

  ngOnDestroy(): void {
    this.stopCarousel();
  }

  loadNewProducts(): void {
    this.customerService.getNewProducts().subscribe({
      next: (res: Product[]) => {
        this.newProduct = res;
        this.newProduct.forEach(ele =>{
          ele.actualPrice = ele.price - ele.discount;
        })
        this.copyNewProduct = JSON.stringify(this.newProduct)
        this.setupCarousel();
        console.log('New products:', this.newProduct);
      },
      error: (error) => {
        console.log('Error while fetching the newProduct Service', error);
      },
    });
  }

  loadFeaturedProducts(): void {
    this.customerService.getFeaturedProducts().subscribe({
      next: (res: Product[]) => {
        this.featuredProduct = res;
        this.featuredProduct.forEach(ele =>{
          ele.actualPrice = ele.price - ele.discount;
        })
        this.copyFeaturedProduct = JSON.stringify(this.featuredProduct)
        this.setupCarousel();
        console.log('Featured products:', this.featuredProduct);
      },
      error: (error) => {
        console.log('Error while fetching the featured products', error);
      },
    });
  }

  setupCarousel(): void {
    this.carouselItems = [];

    this.featuredProduct.forEach((product) => {
      if (product.image && product.image.length > 0) {
        product.image.forEach((image) => {
          this.carouselItems.push({
            image: image,
            productId: product._id,
          });
        });
      }
    });

    this.newProduct.forEach((product) => {
      if (product.image && product.image.length > 0) {
        product.image.forEach((image) => {
          this.carouselItems.push({
            image: image,
            productId: product._id,
          });
        });
      }
    });

    this.carouselItems = this.carouselItems.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.image === item.image)
    );

    if (this.carouselItems.length > 0) {
      this.startCarousel();
    }
  }

  startCarousel(): void {
    this.stopCarousel();
    this.carouselInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopCarousel(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  nextSlide(): void {
    if (this.carouselItems.length === 0) return;
    this.currentSlide = (this.currentSlide + 1) % this.carouselItems.length;
  }

  prevSlide(): void {
    if (this.carouselItems.length === 0) return;
    this.currentSlide =
      this.currentSlide === 0
        ? this.carouselItems.length - 1
        : this.currentSlide - 1;
  }

  goToSlide(index: number): void {
    if (index >= 0 && index < this.carouselItems.length) {
      this.currentSlide = index;
    }
  }

  getCurrentProductId(): number {
    return this.carouselItems[this.currentSlide]?.productId;
  }

  // Add event handlers for product card actions
  onAddToCart(product: Product): void {
    console.log('Add to cart:', product);
    // Implement add to cart logic here
  }

  onAddToWishlist(product: Product): void {
    console.log('Add to wishlist:', product);
    // Implement add to wishlist logic here
  }
}