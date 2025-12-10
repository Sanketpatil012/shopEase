import { Router } from '@angular/router';
import { Category } from './../../../type/category';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { CategoryService } from '../../../services/category.service';
import { BrandService } from '../../../services/brand.service';
import { Brand } from '../../../type/brand';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-product-form',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  categoryArray: Category[] = [];
  BrandArray: Brand[] = [];
  public id!: string;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private BrandService: BrandService,
    private ProductService: ProductService,
    private routes: Router,
    private activateRoute: ActivatedRoute
  ) {
    this.productForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      shortDescription: [null, [Validators.required]],
      description: [null, [Validators.required]],
      price: ['', [Validators.required]],
      discount: [],
      images: this.formBuilder.array([]),
      categoryId: ['', [Validators.required]],
      brandId: ['', Validators.required],
      isFeatured: [false],
      isNewProduct: [false],
    });
  }

  ngOnInit() {
    this.getCategories();
    this.getBrandCategory();
    this.id = this.activateRoute.snapshot.params['id'];

    if (this.id) {
      this.loadData();
    }
  }

  loadData() {
    this.ProductService.getProductById(this.id).subscribe((result: any) => {
      while (this.images.length !== 0) {
        this.images.removeAt(0);
      }

      if (result.image && result.image.length > 0) {
        result.image.forEach((img: string | null) => {
          this.images.push(this.formBuilder.control(img));
        });
      }

      this.productForm.patchValue({
        name: result.name,
        shortDescription: result.shortDescription,
        description: result.description,
        price: result.price,
        discount: result.discount || 0,
        categoryId: result.categoryId,
        brandId: result.brandId,
        isFeatured: result.isFeatured || false,
        isNewProduct: result.isNewProduct || false,
      });
    });
  }

  getCategories() {
    this.categoryService.getCategory().subscribe({
      next: (res: Category[]) => {
        this.categoryArray = res;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      },
    });
  }

  getBrandCategory() {
    this.BrandService.getBrandCategory().subscribe({
      next: (res: Brand[]) => {
        this.BrandArray = res;
      },
      error: (error) => {
        console.log('Error while fetching brand Category', error);
      },
    });
  }

  updateProduct() {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;

      const filteredImages = formValue.images.filter(
        (img: string | null) => img !== null && img !== '' && img !== undefined
      );

      const productData = {
        name: formValue.name,
        shortDescription: formValue.shortDescription,
        description: formValue.description,
        price: formValue.price,
        discount: formValue.discount || 0,
        image: filteredImages,
        categoryId: formValue.categoryId,
        brandId: formValue.brandId,
        isFeatured: formValue.isFeatured || false,
        isNewProduct: formValue.isNewProduct || false,
      };

      this.ProductService.updateProduct(this.id, productData).subscribe(
        (res) => {
          alert('Product updated Successfully');
          this.routes.navigate(['/admin/products']);
        },
        (error) => {
          console.error('Error updating product:', error);
          alert('Error updating product: ' + error.message);
        }
      );
    } else {
      alert('Please fill all required fields correctly');
    }
  }

  addProduct() {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;

      const filteredImages = formValue.images.filter(
        (img: string | null) => img !== null && img !== '' && img !== undefined
      );

      const productData = {
        name: formValue.name,
        shortDescription: formValue.shortDescription,
        description: formValue.description,
        price: formValue.price,
        discount: formValue.discount || 0,
        image: filteredImages,
        categoryId: formValue.categoryId,
        brandId: formValue.brandId,
        isFeatured: formValue.isFeatured || false,
         isNewProduct: formValue.isNewProduct || false,
      };

      console.log('Sending product data:', productData);

      this.ProductService.addProduct(productData).subscribe({
        next: (result) => {
          alert('Product added successfully');
          this.routes.navigate(['/admin/products']);
        },
        error: (error) => {
          console.error('Error adding product:', error);
          alert('Error adding product: ' + error.message);
        },
      });
    } else {
      alert('Please fill all required fields correctly');
    }
  }

  addImage() {
    this.images.push(this.formBuilder.control(null));
  }

  get images() {
    return this.productForm.get('images') as FormArray;
  }

  removeImage() {
    if (this.images.length > 0) {
      this.images.removeAt(this.images.controls.length - 1);
    }
  }
}
