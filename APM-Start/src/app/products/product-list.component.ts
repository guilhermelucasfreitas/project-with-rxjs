import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { Subscription, Observable, EMPTY, Subject, combineLatest, BehaviorSubject } from 'rxjs';

import { Product } from './product';
import { ProductService } from './product.service';
import { catchError, map } from 'rxjs/operators';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent  {
  pageTitle = 'Product List';
  errorMessage = '';

  private categorySelectedSubject = new BehaviorSubject<number>(0);
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();

  products$ = combineLatest([
    this.productService.productsWithCategory$,
    this.categorySelectedAction$
  ])
  .pipe(
    //in the first stream, emits the array of products and in the second stream captures the action of the dropdown
    map(([products, selectedCategoryId]) =>
      products.filter(product =>
        selectedCategoryId ? product.categoryId === selectedCategoryId : true)),
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
      })
    );

  categories$ = this.productCategoryService.productCategories$
      .pipe(
        catchError(err => {
          this.errorMessage = err;
          return EMPTY;
        })
      );
    
      // productsSimpleFilter$ = this.productService.productsWithCategory$
      // .pipe(
      //   map(products => 
      //     products.filter(product => this.selectedCategoryId ? product.categoryId === this.selectedCategoryId: true)
      //   )
      // );

    constructor(private productService: ProductService, private productCategoryService: ProductCategoryService) { }
    
    onAdd(): void {
      console.log('Not yet implemented');
    }
    
    onSelected(categoryId: string): void {
      this.categorySelectedSubject.next(+categoryId)
    }
  }
  