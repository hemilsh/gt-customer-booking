import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AppUrlConstants } from 'src/app/appconfig';

@Component({
  selector: 'app-payment-failure',
  templateUrl: './payment-failure.component.html',
  styleUrls: ['./payment-failure.component.scss']
})
export class PaymentFailureComponent implements OnInit {

  
  constructor(private toastr: ToastrService, private router: Router) { 
    this.toastr.error("Your payment is failed", 'Error !');
    this.router.navigate(['/' + AppUrlConstants.home]);
  }

  ngOnInit() {
  }

}
