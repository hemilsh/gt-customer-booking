import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AppComponent } from '../../app.component';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigConstants } from '../../appconfig';
import { ToastrService } from 'ngx-toastr';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }), withCredentials: true
};
class Subscriber {
  public email: string = '';
  constructor(
    view: any = {}
  ) {
    this.email = view.email;
  }
}
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  subscriberForm;
  subscriberModel: Subscriber = new Subscriber();
  @BlockUI() blockUI: NgBlockUI
  constructor(
    private formBuilder: FormBuilder, 
    private appComponent: AppComponent,
    private http: HttpClient,
    private toastr: ToastrService) {

    this.subscriberForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required,Validators.pattern(/^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/), Validators.maxLength(100)])
    });
  }

  ngOnInit() {
  }
  
  get f() { return this.subscriberForm.controls; }
  onSubscribe(formId) {

    if (this.subscriberForm.invalid) {
      // this.appComponent.autoFocusOnErrorField(formId);
      return;
    }
    this.blockUI.start();
    this.http.post(`${AppConfigConstants.baseUrl}/public/subscriber/save`,this.subscriberModel, httpOptions)
      .subscribe(Response => {
        if (Response['code'] >= 1000 && Response['code'] < 2000) {
          this.toastr.success(Response['message'], 'Success');
        } else if (Response['code'] == 2006) {
        } else  {
          this.toastr.error(Response['message'], 'Error !');
        }
        this.blockUI.stop();
      }, error => {
        this.blockUI.stop();
      })
  }
}
