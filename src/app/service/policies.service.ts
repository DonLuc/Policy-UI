import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PolicyHolder } from '../models/policy-holder.model';
import { AvbobPolicy } from '../models/policy.model';


@Injectable({
  providedIn: 'root'
})
export class PoliciesService {
  baseURL = 'https://localhost:7211/api';
  constructor(private http: HttpClient) {
   }

   getPolicyHolders(): Observable<PolicyHolder[]> {
    return this.http.get<PolicyHolder[]>(`${this.baseURL}/policyholder`);
   }

   createPolicyHolder(policyHolder: PolicyHolder): Observable<PolicyHolder> {
    policyHolder.id = '00000000-0000-0000-0000-000000000000';
    return this.http.post<PolicyHolder>(`${this.baseURL}/policyholder`, policyHolder);
   } 

   deletePolicyHolder(policyHolderID: string) {
    return this.http.delete(`${this.baseURL}/policyholder/${policyHolderID}`);
   }

   updatePolicyHolder(policyHolder: PolicyHolder) {
    return this.http.put(`${this.baseURL}/policyholder/${policyHolder.id}`, policyHolder);
   }

   createPolicy(policy: AvbobPolicy) {
    policy.id = '00000000-0000-0000-0000-000000000000';
    return this.http.post<AvbobPolicy>(`${this.baseURL}/policy`, policy);
   }

   getPolicies(): Observable<AvbobPolicy[]> {
    return this.http.get<AvbobPolicy[]>(`${this.baseURL}/policy`);
   }

   deletePolicy(policyID: string) {
    return this.http.delete(`${this.baseURL}/policy/${policyID}`);
   }

   uploadFile(formData: FormData) {
    return this.http.post(`${this.baseURL}/upload`, formData, {reportProgress: true, observe: 'events'});

   }

}
