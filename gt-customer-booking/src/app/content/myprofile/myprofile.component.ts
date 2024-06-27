import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppUrlConstants, AppConfigConstants } from 'src/app/appconfig';
class Profile {
  public id: string = '';
  public name: string = '';
  public email: string = '';
  public mobile: string = '';
  public countryCode: any = {};
  public address: string = '';
  public landmark: string = '';
  public countryView: any = {};
  public stateView: any = {};
  public cityView: any = {};
  public stateName: string ='';
  public cityName: string ='';
  public pincode: string ='';
  public profilepic: any = {};
  public gender: any = {};
  public birthDate: string = '';
  public shortFormOfName: string ='';
  constructor(view: any = {}) {
    this.id = view.id;
    this.name = view.name;
    this.shortFormOfName = view.shortFormOfName;
    this.email = view.email;
    this.mobile = view.mobile;
    this.countryCode = view.countryCode;
    this.address = view.address;
    this.landmark = view.landmark;
    this.countryView = view.countryView;
    this.stateView = view.stateView;
    this.cityView = view.cityView;
    this.stateName = view.stateName;
    this.cityName = view.cityName;
    this.pincode = view.pincode;
    this.profilepic = view.profilepic;
    this.gender = view.gender;
    this.birthDate = view.birthDate;
  }
}
@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.scss']
})
export class MyprofileComponent implements OnInit {
  profileModel;
  imgURL = AppConfigConstants.baseUrl + AppConfigConstants.profileImagePath;
  constructor(private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router) {
    if (this.route.snapshot.data['resolveValue']['view'] != undefined) {
      if (this.route.snapshot.data['resolveValue'].code >= 1000 && this.route.snapshot.data['resolveValue'].code < 2000) {
        let view = this.route.snapshot.data['resolveValue']['view'];
        this.profileModel = new Profile(view);
      } else {
        this.toastr.error(this.route.snapshot.data['resolveValue'].message, 'Error !');
      }
    }
  }

  ngOnInit() {
  }

  editProfile() {
    this.router.navigate(['/' + AppUrlConstants.profileEditModule + this.profileModel.id]);
  }
  openChangePassword() {
    // this.isChangePasswordFormSubmitted = false;
    document.getElementById("changePassword").style.width = "100%";
  }
}
