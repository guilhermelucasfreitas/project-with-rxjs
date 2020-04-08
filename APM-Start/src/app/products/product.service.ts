import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

import { Product } from './product';
import { Supplier } from '../suppliers/supplier';
import { SupplierService } from '../suppliers/supplier.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';
  private suppliersUrl = this.supplierService.suppliersUrl;
  
  //this http request returns an observable, that issues an array of products
  products$ = this.http.get<Product[]>(this.productsUrl)
  .pipe(
    //map(item => item.price * 1,5),
    //maps all products
    map(products => 
      //accessing each product
      products.map(product => ({
        //copying mapped array
        ...product,
        //and changing only the necessary values
        price: product.price * 1.5,
        searchKey: [product.productName]
        }) as Product)
      ),
      tap(data => console.log('Products: ', JSON.stringify(data))),
      catchError(this.handleError)
      );
      
      constructor(private http: HttpClient,
        private supplierService: SupplierService) { }
        
        private fakeProduct() {
          return {
            id: 42,
            productName: 'Another One',
            productCode: 'TBX-0042',
            description: 'Our new product',
            price: 8.9,
            categoryId: 3,
            category: 'Toolbox',
            quantityInStock: 30
          };
        }
        
        private handleError(err: any) {
          // in a real world app, we may send the server to some remote logging infrastructure
          // instead of just logging it to the console
          let errorMessage: string;
          if (err.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            errorMessage = `An error occurred: ${err.error.message}`;
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
          }
          console.error(err);
          return throwError(errorMessage);
        }
        
      }
      