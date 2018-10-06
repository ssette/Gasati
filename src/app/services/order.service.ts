import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order } from '../model/order';
import { OrderItem } from '../model/order_item';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpClient: HttpClient) { }

  getOrderByCustomerId(CustomerId: number): Observable<Order[]> {
    return this.httpClient.get<Order[]>(environment.service_url + 'orders?cust_id=eq.' + CustomerId.toString() + '&ord_status=eq.0');
  }

  getOrderItems(OrderId: number): Observable<OrderItem[]> {
    return this.httpClient.get<OrderItem[]>(environment.service_url + 'order_items?ord_id=eq.' + OrderId.toString());
  }

  deleteOrder(OrderId: number) {
    this.httpClient.delete(environment.service_url + 'orders?ord_id=eq.' + OrderId.toString());
  }

  clearOrder(OrderId: number): Observable<{}> {
    return this.httpClient.delete(environment.service_url + 'order_items?ord_id=eq.' + OrderId.toString());
  }

  addOrder(CustomerId: number): Observable<Order> {

    const httpOptions = {
      headers: new HttpHeaders({
        'prefer':  'return=representetion',
      })
    };

    const order = {cust_id: CustomerId};
    return this.httpClient.post<Order>(environment.service_url + 'orders', order, httpOptions);
  }
  addOrderItems(orderItems: OrderItem[]): Observable<{}> {
    return this.httpClient.post(environment.service_url + 'order_items', orderItems);
  }
}
