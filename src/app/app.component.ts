import { Component, OnInit ,ViewChild } from '@angular/core';
import { MatDialog , MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DiaogComponent } from './diaog/diaog.component';
import { ApiService } from './services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent implements OnInit {
  title = 'Website';
  displayedColumns: string[] = ['productName', 'category', 'date' , 'freshness','price', 'comment', 'action'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  

  constructor(public dialog: MatDialog, private api:ApiService) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  openDialog() {
    this.dialog.open(DiaogComponent,{width: '50%'}).afterClosed().subscribe(val => {
      if(val === 'Save'){
        this.getAllProducts();
      }
    });
  }
  getAllProducts(){
    this.api.getProduct().subscribe({
      next: (res:any) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error:any) => {
        alert('Error occured');
      }
    });
  }
  editProduct(element:any){
    this.dialog.open(DiaogComponent,{width: '50%',data:element}).afterClosed().subscribe(val => {
      if(val === 'Update'){
        this.getAllProducts();
      }
    });
  }
  deleteProduct(id:number){
    this.api.deleteProduct(id).subscribe({
      next: (res:any) => {
        alert('Product deleted successfully');
        this.getAllProducts();
      },
      error: (error:any) => {
        alert('Error occured');
      }
    });
  }
}

