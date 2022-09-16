import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { PolicyHolder } from '../models/policy-holder.model';
import { AvbobPolicy } from '../models/policy.model';
import { PoliciesService } from '../service/policies.service';

@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.css']
})
export class PolicyComponent implements OnInit {
  isCreateMember: boolean = true;
  isEdit: boolean = false;
  isEditPolicy: boolean = false;

  progress: number = 0;

  policyHolderID: string = '';
  idNumberModel: string = '';
  surnameModel: string = '';
  initialsModel: string = '';
  dobModel: string = '';

  policyNoModel: string = '';
  policyStartDateModel: string = '';
  policyInstallmentModel: string = '';

  genderModel: number = 0;

  policyHolders: PolicyHolder[] = [];
  policies: AvbobPolicy[] = [];
  policyHoldersIDs: string[] = [];
  policyFormGroup: FormGroup = new FormGroup(
    {
      policyNumber: new FormControl('', [Validators.required]),
      policyType: new FormControl('', [Validators.required]),
      startDate: new FormControl('', [Validators.required]),
      installment: new FormControl('', [Validators.required]),
    }
  );

  policyHolderFormGroup: FormGroup = new FormGroup(
    {
      idNumber: new FormControl('', [Validators.required, Validators.pattern(new RegExp("^[0-9]*$") ), 
      Validators.minLength(13), Validators.maxLength(13) ]),
      initials: new FormControl('', [Validators.required]),
      surname: new FormControl('', [Validators.required]),
      dob: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required])
    }
  );

  
  constructor(private policyService: PoliciesService) { }

  ngOnInit(): void {
    this.getPolicyHolders();
    this.getPolicies();
  }


  getPolicyHolders() {
    this.policyService.getPolicyHolders().subscribe(response => {
      this.policyHolders = response;
      this.policyHolders.forEach(policyHolder => {
        this.policyHoldersIDs.push(policyHolder.idNumber);
      })
    }, (error) => {
      console.log('Error occurred:::: ' + error);
    });
  }

  getPolicies() {
    this.policyService.getPolicies().subscribe(response => {
      this.policies = response;
      console.log('RETRIEVED POLICIES' + JSON.stringify(response));
    });
  }

  createPolicyHolder() {
    if (this.policyHolderFormGroup.valid) {
      var policyHolder: PolicyHolder = this.policyHolderFactory();
  
      this.policyService.createPolicyHolder(policyHolder).subscribe(response => {
        this.getPolicyHolders();
      }, (error) => {
        alert('Error occurred while creating a policy holder');
      });
    }
  }

  updloadFile(files: any) { 
    debugger;
    if (files.length === 0) 
      return;

    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    this.policyService.uploadFile(formData).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress = Math.round(100 * event.loaded / event.total!);
      } else if (event.type === HttpEventType.Response) {
        console.log('Upload success');
      }
    })

  }

  submitPolicy() {
    if (this.policyFormGroup.valid) {
      debugger;
      var policy: AvbobPolicy = {
        id: '',
        installment: this.policyFormGroup.value['installment'],
        policyNumber: this.policyFormGroup.value['policyNumber'] + '',
        policyType: this.policyFormGroup.value['policyType'],
        commencementDate: this.policyFormGroup.value['startDate'] 
      }
      this.policyService.createPolicy(policy).subscribe(response => {
        console.log(JSON.stringify(response));
      }, error => {
        console.log(JSON.stringify(error));
      });
    }
  }

  deletePolicyHolder(policyHolderID: string) {
    this.policyService.deletePolicyHolder(policyHolderID).subscribe(response => {
      this.getPolicyHolders();
    }, (error) => {
      console.log('Error in deleting member' + JSON.stringify(error));
    })
  }

  deletePolicy(policyID: string) {
    this.policyService.deletePolicy(policyID).subscribe(response => {
      this.getPolicies();
    }, (error) => {
      console.log('Error in deleting policy' + JSON.stringify(error));
    })
  }


  toggleUpdatePolicyHolder(policyHolder: PolicyHolder) {
    //Prepopulate the fields
    this.policyHolderID = policyHolder.id;
    this.dobModel = policyHolder.dob;
    this.surnameModel = policyHolder.surname;
    this.idNumberModel = policyHolder.idNumber;
    this.initialsModel = policyHolder.inititals;
    this.genderModel = policyHolder.gender;
    this.isEdit = true;
  }

  toggleUpdatePolicy(policy: AvbobPolicy) {
    this.isEditPolicy = true;
    this.policyNoModel = policy.policyNumber;
    this.policyInstallmentModel = policy.installment + '';
    this.policyStartDateModel = policy.commencementDate;
  }

  policyHolderFactory(): PolicyHolder {
    var policyHolder: PolicyHolder = {
      dob: this.policyHolderFormGroup.value['dob'],
      gender: parseInt(this.policyHolderFormGroup.value['gender']),
      id: '',
      idNumber: this.policyHolderFormGroup.value['idNumber'],
      inititals: this.policyHolderFormGroup.value['initials'],
      surname: this.policyHolderFormGroup.value['surname']
    }

    return policyHolder;
  }

  updateMember() {
    if (this.policyHolderFormGroup.valid) {
      var policyHolder: PolicyHolder = this.policyHolderFactory();
      policyHolder.id = this.policyHolderID;
      this.policyService.updatePolicyHolder(policyHolder).subscribe(response => {
        this.getPolicyHolders();
      }, (error) => {
        console.log('Error occurred::: ' + JSON.stringify(error));
      });

    } else {
      alert('NOT VALID');
    }
  }

  
}
