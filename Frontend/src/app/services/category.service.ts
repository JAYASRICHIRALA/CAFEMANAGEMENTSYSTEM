import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  getFilteredCategorys() {
    throw new Error('Method not implemented.');
  }

  url=environment.apiUrl;


  constructor(private httpClient:HttpClient) { }

  add(data:any)
  {
    return this.httpClient.post(this.url+
      "/category/add",data,{
        headers:new HttpHeaders().set('Content-Type',"application/json")
      }
    )
  }

  update(data:any)
  {
    return this.httpClient.post(this.url+
      "/category/update",data,{
        headers:new HttpHeaders().set('Content-Type',"application/json")
      }
    )
  }

  getCategorys()
  {
    return this.httpClient.get(this.url+"/category/get");
  }

  getFilteredCategory(){
    return this.httpClient.get(this.url + "/category/get?filterValue=true");
  }

}
