import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../model/customer';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { empty } from 'rxjs';
import { Product } from '../model/product';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service';
import { Order } from '../model/order';
import { OrderItem, OrderItemWProduct } from '../model/order_item';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  emailForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  customer: Customer | undefined;
  products: Product[] | undefined;
  customers: Customer[] | undefined;
  orders: Order[] | undefined;
  order: Order;
  order_items: OrderItem[] | undefined;
  order_list: OrderItemWProduct[] | undefined;
  empty_order = false;
  order_id: number;
  emailChecked = false;
  checkError = false;

  constructor(private customerService: CustomerService,
              private productService: ProductService,
              private orderService: OrderService) { }

  get email() {
    return this.emailForm.get('email');
  }

  prepareOrderItems() {
    this.order_items = [];
    this.order_list.forEach(element => {
      if (element.oitm_quantity > 0) {
        this.order_items.push({ord_id: this.order.ord_id,
                               prod_id: element.prod_id,
                               oitm_quantity: element.oitm_quantity});
      }
    });
  }
  generateOrderList() {
    this.products.forEach(element => {
      let qty = 0;
      let oi: OrderItem;
      if (!isNullOrUndefined(this.order)) {
        oi = this.order_items.find(x => x.prod_id === element.prod_id);
        if (oi !== undefined) {
          qty = oi.oitm_quantity;
        }
      }
      this.order_list.push({ord_id: 0, oitm_quantity: qty, ...element});
    });
  }

  getProducts() {
    this.productService.getProducts().subscribe(
      products => {this.products = products;
                   console.warn(this.products);
      }
    );
  }

  async saveOrder() {
    this.checkEmptyOrder();
    console.warn(this.empty_order);
    if (this.empty_order) {
      return;
    }
    if (isNullOrUndefined(this.order)) {
      // inserire il nuovo ordine
      this.order = await this.orderService.addOrder(this.customer.cust_id).toPromise();
      console.warn(this.order);
    } else {
      // eliminare le righe che verranno poi reinserite
      await this.orderService.clearOrder(this.order.ord_id).toPromise();
    }
    // preparazione dell'array contenente le righe
    this.prepareOrderItems();
    console.warn(this.order_items);
    // scrittura delle righe
    await this.orderService.addOrderItems(this.order_items).toPromise();

  }

  checkEmptyOrder() {
    if (isNullOrUndefined(this.order_list)) {
      this.empty_order = false;
    } else {
      this.empty_order = false;
      this.order_list.forEach(item => {
        console.warn(item.oitm_quantity);
        if (item.oitm_quantity === 0) {
          this.empty_order = true;
        }
      });
    }
  }
  async checkCustomer() {

    this.emailChecked = false;
    this.checkError = false;
    this.customer = null;
    this.order = null;
    this.order_list = [];
    this.customers = await this.customerService.getCustomerByEmail(this.email.value).toPromise();
    if (!isNullOrUndefined(this.customers[0])) {
      console.warn(this.customers[0]);
      this.emailChecked = true;
      this.customer = this.customers[0];
      this.orders = await this.orderService.getOrderByCustomerId(this.customer.cust_id).toPromise();
      if (!isNullOrUndefined(this.orders[0])) {
        console.warn(this.orders[0]);
        this.order = this.orders[0];
        this.order_items = await this.orderService.getOrderItems(this.order.ord_id).toPromise();
        console.warn(this.order_items);
      }
    } else {
      this.emailChecked = false;
      this.checkError = true;
    }
    this.generateOrderList();
    console.warn(this.order_list);
  }

  showResult() {
    console.warn(this.order_list);
  }

  get orderExists(): boolean {
    return !isNullOrUndefined(this.order);
  }

  get orderWasModified(): boolean {
    return this.orderExists && !isNullOrUndefined(this.order.ord_last_modified);
  }

  ngOnInit() {
    this.getProducts();
  }

}
