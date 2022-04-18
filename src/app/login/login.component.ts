import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '@app/services/login.service';
import { MustMatch } from '../helper/MustMatch';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  isError = false;
  returnUrl: string;
  error: string;
  success: string;

  websiteList: any = [
    { id: 'Company1', name: 'Company1', flag: false },
    { id: 'Company2', name: 'Company2', flag: false },
    { id: 'Company3', name: 'Company3', flag: false },
    { id: 'Company4', name: 'Company4', flag: false },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
  ) {
    // redirect to home if already logged in
    // if (this.authenticationService.currentUserValue) {
    //     this.router.navigate(['/']);
    // }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      contact: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern('^[0-9]+$')]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      website: this.formBuilder.array([]),
      password: ['', [Validators.required, Validators.minLength(7), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!#%*?&])[A-Za-z\d$@$#!%*?&].{7,}')]],
      cpassword: ['', [Validators.required, Validators.minLength(7), Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!#%*?&])[A-Za-z\d$@$#!%*?&].{7,}')]],
    }, {
      validator: MustMatch('password', 'cpassword')
    });;

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  passwordMatchValidator(frm: FormGroup) {
    return frm.controls['newPassword'].value === frm.controls['repeatNewPassword'].value ? null : { 'mismatch': true };
  }

  // convenience getter for easy access to form fields
  get lf() { return this.loginForm.controls; }
  get rf() { return this.registerForm.controls; }

  onRegister() {
    this.submitted = true;
    let modules = this.rf.website.value
    var result = modules.map(function (val) {
      return val;
    }).join(',');
    if (!this.rf.name.value) {
      this.error = "Please enter name"
    } else if (!this.rf.contact.value) {
      this.error = "Please enter contact"
    } else if (!this.rf.email.value) {
      this.error = "Please enter email"
    } else if (!this.rf.address.value) {
      this.error = "Please enter address"
    } else if (modules == "") {
      this.error = "Please enter company"
    } else if (!this.rf.password.value) {
      this.error = "Please enter password"
    } else {
      alert("wqw")
      this.loading = true;
      this.loginService.addUser(this.rf.name.value, this.rf.contact.value, this.rf.email.value, this.rf.address.value, result, this.rf.password.value)
        .pipe(first())
        .subscribe(
          data => {
            console.log(data)
            window.location.reload();
          },
          error => {
            this.loading = false;
          });
    }
    setTimeout(() => {
      this.success = "";
      this.error = "";
    }, 4000)
  }

  onLogin() {
    this.submitted = true;
    if (!this.lf.email.value) {
      this.error = "Please enter email"
    } else if (!this.lf.password.value) {
      this.error = "Please enter password"
    } else {
      this.loading = true;
      this.loginService.login(this.lf.email.value, this.lf.password.value)
        .pipe(first())
        .subscribe(
          data => {
            this.router.navigate(['home']);
          },
          error => {
            this.loading = false;
          });
    }
    setTimeout(() => {
      this.success = "";
      this.error = "";
    }, 4000)
  }

  onCheckboxChange(e) {
    const website: FormArray = this.registerForm.get('website') as FormArray;

    if (e.target.checked) {
      website.push(new FormControl(e.target.value));
    } else {
      const index = website.controls.findIndex(x => x.value === e.target.value);
      website.removeAt(index);
    }
  }
}