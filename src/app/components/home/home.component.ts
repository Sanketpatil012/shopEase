import { Category } from './../../type/category';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../../type/product';
import { CustomerService } from '../../services/customer.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { HeaderComponent } from '../header/header.component';
import { ProductService } from '../../services/product.service';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { OrderService } from '../../services/order.service';
@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  newProduct: Product[] = [];
  featuredProduct: Product[] = [];
  categoryProduct: Product[] = [];

  private cachedNewProducts: Product[] = [];
  private cachedFeaturedProducts: Product[] = [];
  private cachedCategoryProducts: Product[] = [];

  isSearch: boolean = false;
  public selectedCategory: string | null = null;
  private currentSearchTerm: string = '';

  carouselItems: { image: string; productId: number }[] = [];
  currentSlide = 0;
  private carouselInterval: any;
  selectedCategoryName: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private customerService: CustomerService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private orderService: OrderService,
  ) {}

  ngOnInit(): void {
    this.subscribeToRouteChanges();
    this.subscribeToSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopCarousel();
  }

  private subscribeToRouteChanges(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const categoryId = params['category'];
        const categoryName = params['categoryName'];

        if (categoryId) {
          this.handleCategorySelection(categoryId, categoryName);
        } else {
          this.handleNoCategory();
        }
      });
  }
  onAddToCart(product: Product): void {
    this.orderService.addCart(product._id, 1).subscribe({
      next: (response) => {
        console.log('Product added to cart:', response);
        // Optional: Show success message
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
      },
    });
  }

  private handleCategorySelection(
    categoryId: string,
    categoryName: string,
  ): void {
    this.selectedCategory = categoryId;
    this.selectedCategoryName = categoryName;
    this.featuredProduct = [];
    this.newProduct = [];
    this.loadProductsByCategory(categoryId);
  }

  private handleNoCategory(): void {
    this.selectedCategory = null;
    this.categoryProduct = [];
    this.loadNewProducts();
    this.loadFeaturedProducts();
  }

  private subscribeToSearch(): void {
    this.productService.searchTerm
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.handleSearch(value);
      });
  }

  private handleSearch(searchTerm: string): void {
    this.currentSearchTerm = searchTerm?.toLowerCase().trim() || '';

    if (!this.currentSearchTerm) {
      this.isSearch = false;
      this.resetProductsToCache();
    } else {
      this.isSearch = true;
      this.applySearchFilter();
    }
  }

  private resetProductsToCache(): void {
    if (this.selectedCategory) {
      this.categoryProduct = [...this.cachedCategoryProducts];
    } else {
      this.newProduct = [...this.cachedNewProducts];
      this.featuredProduct = [...this.cachedFeaturedProducts];
    }
  }

  private applySearchFilter(): void {
    if (this.selectedCategory) {
      // Filter only category products when in category view
      this.categoryProduct = this.cachedCategoryProducts.filter((product) =>
        this.productMatchesSearch(product, this.currentSearchTerm),
      );
    } else {
      // Filter new and featured products separately when in home view
      this.newProduct = this.cachedNewProducts.filter((product) =>
        this.productMatchesSearch(product, this.currentSearchTerm),
      );
      this.featuredProduct = this.cachedFeaturedProducts.filter((product) =>
        this.productMatchesSearch(product, this.currentSearchTerm),
      );
    }
  }

  private productMatchesSearch(product: Product, searchTerm: string): boolean {
    if (!searchTerm) return true;

    const searchFields = [
      product.name,
      product.shortDescription,
      product.price?.toString(),
      product.actualPrice?.toString(),
    ].filter((field) => field);

    return searchFields.some((field) =>
      field.toLowerCase().includes(searchTerm),
    );
  }

  loadProductsByCategory(categoryId: string): void {
    this.productService.getProductByCategory(categoryId).subscribe({
      next: (res: any) => {
        this.processCategoryProducts(res.product);
        // Re-apply search filter if there's an active search
        if (this.currentSearchTerm) {
          this.applySearchFilter();
        }
      },
      error: (error) => {
        console.error('Error while fetching the products ', error);
      },
    });
  }

  private processCategoryProducts(products: Product[]): void {
    this.categoryProduct = products.map((product) => ({
      ...product,
      actualPrice: this.calculateActualPrice(product),
    }));
    this.cachedCategoryProducts = [...this.categoryProduct];
  }

  loadNewProducts(): void {
    this.customerService.getNewProducts().subscribe({
      next: (res: Product[]) => {
        this.processNewProducts(res);
        // Re-apply search filter if there's an active search
        if (this.currentSearchTerm) {
          this.applySearchFilter();
        }
      },
      error: (error) => {
        console.error('Error while fetching the newProduct Service', error);
      },
    });
  }

  private processNewProducts(products: Product[]): void {
    this.newProduct = products.map((product) => ({
      ...product,
      actualPrice: this.calculateActualPrice(product),
    }));
    this.cachedNewProducts = [...this.newProduct];
    this.setupCarousel();
  }

  loadFeaturedProducts(): void {
    this.customerService.getFeaturedProducts().subscribe({
      next: (res: Product[]) => {
        this.processFeaturedProducts(res);
        // Re-apply search filter if there's an active search
        if (this.currentSearchTerm) {
          this.applySearchFilter();
        }
      },
      error: (error) => {
        console.error('Error while fetching the featured products', error);
      },
    });
  }

  private processFeaturedProducts(products: Product[]): void {
    this.featuredProduct = products.map((product) => ({
      ...product,
      actualPrice: this.calculateActualPrice(product),
    }));
    this.cachedFeaturedProducts = [...this.featuredProduct];
    this.setupCarousel();
  }

  private calculateActualPrice(product: Product): number {
    return (product.price || 0) - (product.discount || 0);
  }

  setupCarousel(): void {
    // Only setup carousel on home page (no category selected)
    if (this.selectedCategory || this.carouselItems.length > 0) return;

    const allProducts = [...this.featuredProduct, ...this.newProduct];
    const carouselItems: { image: string; productId: number }[] = [];
    const imageSet = new Set<string>();

    for (const product of allProducts) {
      if (product.image?.length) {
        for (const image of product.image) {
          if (!imageSet.has(image)) {
            imageSet.add(image);
            carouselItems.push({
              image: image,
              productId: product._id,
            });
          }
        }
      }
    }

    this.carouselItems = carouselItems;

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
      this.carouselInterval = null;
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

  onAddToWishlist(product: Product): void {
    console.log('Add to wishlist:', product);
  }
}
