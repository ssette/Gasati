import { Injectable } from '@angular/core';
import { Customer } from '../model/customer';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

    command: string;
    constructor(private httpClient: HttpClient) { }


  getCustomerByEmail(email: string): Observable<Customer[]> {
    this.command = environment.service_url + 'customers?cust_email=eq.' + email;
    return this.httpClient.get<Customer[]>(this.command);
  }

}
