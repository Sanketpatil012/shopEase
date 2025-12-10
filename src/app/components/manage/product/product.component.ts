import { ProductService } from '../../../services/product.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'id',
    'name',
    'price',
    'shortDescription',
    'discount',
    'action',
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.serveData();
  }

  ngAfterViewInit() {
    // Set paginator and sort after view initialization
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  private serveData() {
    this.productService.getAllProducts().subscribe((result: any) => {
      console.log(result);
      this.dataSource.data = result; // Update data property instead of creating new instance

      // Reassign paginator and sort in case they were lost
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  delete(id: string) {
    console.log(id);
    this.productService.deleteProductbyId(id).subscribe((result: any) => {
      alert('The product is deleted');
      this.serveData();
    });
  }
}
