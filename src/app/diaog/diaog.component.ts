import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-diaog',
  templateUrl: './diaog.component.html',
  styleUrls: ['./diaog.component.css']
})
export class DiaogComponent implements OnInit {

  freshnessList=['Fresh','Frozen','Dried'];
  productForm !: FormGroup;
  actionBtn:string = 'Save';

  constructor(private formBuilder : FormBuilder,
    @Inject(MAT_DIALOG_DATA) public editData:any,
  private api:ApiService, private dialogRef:MatDialogRef<DiaogComponent>) { }
  
  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      productName: ['',Validators.required],
      category: ['',Validators.required],
      freshness: ['',Validators.required],
      price: ['',Validators.required],
      comment: ['',Validators.required],
      date: ['',Validators.required],
    });
    if(this.editData){
      this.actionBtn = 'Update';
      this.productForm.patchValue(this.editData);
    }
  }
  addProduct(){
    if(!this.editData){if(this.productForm.valid){
      this.api.postProduct(this.productForm.value).subscribe({
        next: (res:any) => {
          alert('Product added successfully');
          this.dialogRef.close('success');
        },
        error: (error:any) => {
          alert('Error occured');
          console.log(error);
        }
      });
    }
  }else{
    this.api.putProduct(this.productForm.value,this.editData.id).subscribe({
      next: (res:any) => {
        alert('Product updated successfully');
        this.productForm.reset();
        this.dialogRef.close('update');
      },
      error: (error:any) => {
        alert('Error occured');
        console.log(error);
      }
    });
    }
  }
}
