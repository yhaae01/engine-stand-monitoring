import { Injectable } from "@angular/core";
import { PaginationResultDTO } from "../dto/pagination.result.dto";

@Injectable()
export class PaginatorUtil {


  paginator<T>(paginationResult: PaginationResultDTO<T>): PaginationResultDTO<T> {

    const lastPage: number = this.getLastPage(paginationResult.count, paginationResult.data.length);
    const nextPage: number | null = this.getNextPage(paginationResult.currentPage, lastPage);
    const prevPage: number | null = this.getPrevPage(paginationResult.currentPage);

    paginationResult.nextPage = nextPage;
    paginationResult.lastPage = lastPage;
    paginationResult.prevPage = prevPage;
    return paginationResult;
  }

  getLastPage(aggregateCount: number, dataLength: number): number {
    return Math.ceil(aggregateCount / dataLength);
  }

  getNextPage(currentPage: number, lastPage: number): number | null{
    if(currentPage == lastPage) {
      return null;
    }

    return currentPage + 1;
  }

  getPrevPage(currentPage: number): number | null{
    
    if(currentPage == 0) {
      return null;
    }

    return currentPage;
  }
}