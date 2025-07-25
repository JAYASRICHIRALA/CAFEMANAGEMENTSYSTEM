import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { saveAs } from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { NgxUiLoaderBlurredDirective } from 'ngx-ui-loader/lib/core/ngx-ui-loader-blurred.directive';
import { BillService } from 'src/app/services/bill.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductService } from 'src/app/services/product.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';


@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit {

  displayedColumns:string[]=['name','category','price','quantity','total','edit'];
  dataSource: Array<any>=[];
  manageOrderForm:any= FormGroup;
  categorys:any=[];
  products:any=[];
  price:any;
  totalAmount:number=0;
  responseMessage:any;
 
  constructor(private formBuilder:FormBuilder,
     private categoryService:CategoryService,
     private snackbarService:SnackbarService,
     private billService:BillService,
     private ngxService:NgxUiLoaderService,
     private productService:ProductService

  ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.getCategorys();
    this.manageOrderForm = this.formBuilder.group({
      name:[null,[Validators.required,Validators.pattern(GlobalConstants.nameRegex)]],
      email:[null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Updated pattern
      paymentMethod:[null,[Validators.required]],
      product:[null,[Validators.required]],
      category:['',[Validators.required]],
      quantity:[null,[Validators.required,Validators.pattern('^[1-9][0-9]*$')]],
      price:[null,[Validators.required]],
      total:[null,[Validators.required]]
    });

  }
  getCategorys() {
    this.categoryService.getFilteredCategory().subscribe((response:any)=>{
      this.ngxService.stop();
      this.categorys= response;
    },(error:any)=>{
    this.ngxService.stop();
    console.log(error);
    if(error.error?.message){
      this.responseMessage = error.error?.message ;
    }else{
      this.responseMessage = GlobalConstants.genericError;
    }
     
    this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
  })
  }

  getProductsBycategory(value:any){
    this.productService.getProductsBycategory(value.id).subscribe((response:any)=>{
      this.products=response;
      this.manageOrderForm.controls['price'].setValue('');
      this.manageOrderForm.controls['quantity'].setValue('');
      this.manageOrderForm.controls['total'].setValue(0);


  },(error:any)=>{
    this.ngxService.stop();
    console.log(error);
    if(error.error?.message){
      this.responseMessage = error.error?.message ;
    }else{
      this.responseMessage = GlobalConstants.genericError;
    }
     
    this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
})
  }

  getProductDetails(value:any){
    this.productService.getById(value.id).subscribe((response:any)=>{
            this.price=response.price;
            this.manageOrderForm.controls['price'].setValue(response.price); 
            this.manageOrderForm.controls['quantity'].setValue('1'); 

            this.manageOrderForm.controls['total'].setValue(this.price*1); 

    },(error:any)=>{
      this.ngxService.stop();
      console.log(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message ;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
       
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
  })
  }

  setQuantity(value:any){
    var temp=this.manageOrderForm.controls['quantity'].value;
    if(temp>0){
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value);
      
    }
    else if(temp!=''){


      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value);

    }
  }

  validateProductAdd(){
    if(this.manageOrderForm.controls['total'].value===0 || this.manageOrderForm.controls['total'].value===null || this.manageOrderForm.controls['quantity'].value <=0){
      return true;
    }
    else{
         return false;
    }
  }
   validateSubmit(){
      if(this.totalAmount===0 || this.manageOrderForm.controls['name'].value===null || this.manageOrderForm.controls['email'].value===null
        || this.manageOrderForm.controls['contactNumber'].value===null||this.manageOrderForm.controls['paymentMethod'].value===null){
            return true;
      }
      else{
        return false;
      }
   }
   
   add() {
    const formData = this.manageOrderForm.value;
    
    // Using optional chaining to prevent errors if product or name is undefined
    if (!formData.product?.name) {
      this.snackbarService.openSnackBar("Please select a valid product", GlobalConstants.error);
      return;
    }
  
    // Existing logic to check if the product already exists in the dataSource
    const existingProduct = this.dataSource.find((e: { id: number }) => e.id === formData.product.id);
    
    if (!existingProduct) {
      this.totalAmount += formData.total;
      this.dataSource.push({
        id: formData.product.id,
        name: formData.product.name,
        category: formData.product.category?.name ,
        quantity: formData.quantity,
        price: formData.price,
        total: formData.total
      });
      this.dataSource = [...this.dataSource];
      this.snackbarService.openSnackBar(GlobalConstants.productAdded, "success");
    } else {
      this.snackbarService.openSnackBar(GlobalConstants.productExistError, GlobalConstants.error);
    }
  }
  

   handleDeleteAction(value:any,element:any){
    this.totalAmount=this.totalAmount-element.total;
    this.dataSource.splice(value,1);
    this.dataSource=[...this.dataSource];
   }

   submitAction(){
    var formData=this.manageOrderForm.value;
    var data={
      name:formData.name,
      email:formData.email,
      contactNumber:formData.contactNumber,
      paymentMethod:formData.paymentMethod,
      totalAmount:this.totalAmount.toString(),
      productDetails:JSON.stringify(this.dataSource)
    }
    this.ngxService.start();
    this.billService.generateReport(data).subscribe((response:any)=>{
      this.downloadFile(response?.uuid);
      this.manageOrderForm.reset();
      this.dataSource=[];
      this.totalAmount=0;
    },(error:any)=>{
      this.ngxService.stop();
      console.log(error);
      if(error.error?.message){
        this.responseMessage = error.error?.message ;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
       
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
  })
   }
   downloadFile(fileName:string){
     var data={
      uuid:fileName

     }
     this.billService.getPdf(data).subscribe((response:any)=>{
        saveAs(response,fileName+ '.pdf');
        this.ngxService.stop()
     })
   }
}
