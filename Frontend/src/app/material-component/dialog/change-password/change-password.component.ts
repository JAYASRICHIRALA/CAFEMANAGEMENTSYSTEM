import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  oldPassword= true;
  newPassword= true;
  confirmPassword=true;
  changePasswordForm:any = FormGroup;
  responseMessage:any;

  constructor(private formBuilder:FormBuilder,
    private userService:UserService,
    public dialogRef:MatDialogRef<ChangePasswordComponent>,
    private ngxService:NgxUiLoaderService,
    private snackbarService:SnackbarService
  ) {}

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: [null, Validators.required],
      newPassword: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    })
  }


  validateSubmit(){
    if(this.changePasswordForm.controls['newPassword'].value != this.changePasswordForm.controls['confirmPassword'].value)
    {
      return true;
    }
    else{
      return false;
    }

  }
   /* handlepasswordChangeSubmit() {
        this.ngxService.start();
        const formData = this.changePasswordForm.value;
        const data = {
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword,
            confirmPassword: formData.confirmPassword
        };
    
        this.userService.changePassword(data, { responseType: 'text' as 'json' }).subscribe(
            (response: string) => {
                console.log("Received response from backend:", response);
                this.ngxService.stop();
    
                // Treat any non-error response as a success
                if (response.includes('Password Updated Successfully')) {
                    this.responseMessage = "Password updated successfully";
                    this.snackbarService.openSnackBar(this.responseMessage, "success");
                    this.dialogRef.close();
                } else {
                    console.log("Unexpected response format:", response);
                    this.responseMessage = "Password updated successfully";
                    this.snackbarService.openSnackBar(this.responseMessage, "success");
                    this.dialogRef.close();
                }
            },
            (error: HttpErrorResponse) => {
                console.error("Error encountered:", error);
                this.ngxService.stop();
    
                // Handle the 200 status error due to unexpected text response format
                if (error.status === 200 && typeof error.error.text === 'string') {
                    this.responseMessage = "Password updated successfully";
                    this.snackbarService.openSnackBar(this.responseMessage, "success");
                    this.dialogRef.close();
                } 
                else if(error.status ===400 && typeof error.error.text=='string'){
                  this.responseMessage = "Incorrect Old Password";
                    this.snackbarService.openSnackBar(this.responseMessage, "success");
                    this.dialogRef.close();
                }
                else {
                    // Use either specific error message or generic error
                    this.responseMessage = error.error?.message || GlobalConstants.genericError;
                    this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
                }
            }
        );
    }*/
    
        handlepasswordChangeSubmit() {
          this.ngxService.start();
          const formData = this.changePasswordForm.value;
          const data = {
              oldPassword: formData.oldPassword,
              newPassword: formData.newPassword,
              confirmPassword: formData.confirmPassword
          };
      
          // Explicitly set responseType to 'text'
          this.userService.changePassword(data, { responseType: 'text' }).subscribe(
              (response: string) => {
                  console.log("Received response from backend:", response);
                  this.ngxService.stop();
      
                  // Check if response contains success message
                  if (response.includes('Password Updated Successfully')) {
                      this.responseMessage = "Password updated successfully";
                      this.snackbarService.openSnackBar(this.responseMessage, "success");
                      this.dialogRef.close();
                  } else {
                      console.log("Unexpected response format:", response);
                      this.responseMessage = "Password updated successfully";
                      this.snackbarService.openSnackBar(this.responseMessage, "success");
                      this.dialogRef.close();
                  }
              },
              (error: HttpErrorResponse) => {
                  console.error("Error encountered:", error);
                  this.ngxService.stop();
      
                  // Handle error responses based on status
                  if (error.status === 400) {
                      if (error.error === 'Incorrect Old Password') {
                          // Handle incorrect old password error
                          this.responseMessage = "Incorrect old password.";
                      } else if (typeof error.error === 'string') {
                          // Handle other 400 errors with string message
                          this.responseMessage = error.error;
                      } else {
                          // Default error message for 400 Bad Request
                          this.responseMessage = "Bad Request. Please check your inputs.";
                      }
                  } else if (error.status === 200 && typeof error.error === 'string') {
                      // Handle the case where 200 OK returns a plain text message
                      this.responseMessage = error.error || "Password updated successfully";
                  } else {
                      // Handle other errors (not 200 or 400)
                      this.responseMessage = GlobalConstants.genericError;
                  }
      
                  // Display the error message
                  this.snackbarService.openSnackBar(this.responseMessage, "error");
              }
          );
      }
      
        
      
      
  
  

    

}
