import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CategoryService } from '../../../services/category.service';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-categories',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule , MatButtonModule , RouterLink ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
     this.serveData()
  }

  private serveData(){
    this.categoryService.getCategory().subscribe((result: any) => {
      console.log(result);
      this.dataSource = new MatTableDataSource(result);
      this.dataSource.paginator=  this.paginator
      this.dataSource.sort = this.sort 
    }); 
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
   delete(id:string){
     console.log(id)
     this.categoryService.getDeleteCategory(id).subscribe((result:any)=>{
        alert("The category Was deleted ")
        this.serveData()
      }) 
    }

}

