import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {

  displayedColumns:string[]=['name','email','contactNumber','status'];
  dataSource:any;
  responseMessage:any;
  constructor(
    private ngxService:NgxUiLoaderService,
    private userService:UserService,
    private snacknarService:SnackbarService
) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }
  tableData(){
    this.userService.getUsers().subscribe((response:any)=>{
      this.ngxService.stop();
      this.dataSource=new MatTableDataSource(response);
    },(error:any)=>{
      this.ngxService.stop();
      console.log(error.error?.message);
      if(error.error?.message){
       this.responseMessage=error.error?.message;
      }
      else{
       this.responseMessage=GlobalConstants.genericError;
      }
      this.snacknarService.openSnackBar(this.responseMessage,GlobalConstants.error);
  })
  }

  applyFilter(event:Event){
    const filterValue=(event.target as HTMLInputElement).value;
    this.dataSource.filter=filterValue.trim().toLocaleLowerCase();

  }

  onChange(status:any,id:any){
    this.ngxService.start();
    var data={
      status:status.toString(),
      id:id
    }
    this.userService.update(data).subscribe((response:any)=>{
      this.ngxService.stop();
      this.responseMessage=response?.message;
      this.snacknarService.openSnackBar(this.responseMessage,"success");
    },(error:any)=>{
      this.ngxService.stop();
      console.log(error.error?.message);
      if(error.error?.message){
       this.responseMessage=error.error?.message;
      }
      else{
       this.responseMessage=GlobalConstants.genericError;
      }
      this.snacknarService.openSnackBar(this.responseMessage,GlobalConstants.error);
  })

  }
}
