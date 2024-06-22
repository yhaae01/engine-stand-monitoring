import { HttpService } from 'src/app/providers/http/http.service';
import { ReviewDTO } from '../dto/review.dto';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class ReviewService extends HttpService<ReviewDTO> {
  constructor(private readonly httpClient: HttpClient) {
    super(httpClient);
  }

  sendFeedback(requestBody: ReviewDTO): Observable<any> {
    const headers = new HttpHeaders().set(
      'x-api-key',
      'E7B8-48B9-FD36-E02F-56F3'
    );

    return this.feedbackUrl(
      'https://api.gmf-aeroasia.co.id/utils/review/**',
      requestBody,
      headers
    );
  }
}
