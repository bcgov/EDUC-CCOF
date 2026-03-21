<template>
  <div>
    <!-- Currently this component is only used for Report Other Changes or MTFI change Requests. Add New Facility uses PCF Summary Dec-->
    <template v-if="isDeclarationADisplayed">
      <p>
        I hereby confirm that the information I have provided in this application is complete and accurate. I certify
        that I have read and understand the following requirements:
      </p>
      <ul class="ml-5 pt-5">
        <li>Each facility must be licensed under the Community Care and Assisted Living Act;</li>
        <li>
          Each facility must be in compliance with the Community Care and Assisted Living Act and Child Care Licensing
          Regulation;
        </li>
        <li>
          Each facility must be willing to provide services to families who receive the Affordable Child Care Benefit;
        </li>
        <li>
          The organization must be in good standing with BC Registrar of Companies (if a nonprofit society or a
          registered company); and
        </li>
        <li>
          The applicant must be in good standing with the Ministry of Education and Child Care (that is, the Applicant
          must either have no outstanding balances owing to the Ministry OR the Applicant must have established payment
          plans for outstanding balances and these must be in good standing).
        </li>
      </ul>
      <p class="pt-3">
        Intentionally supplying information that is false or misleading with respect to a material fact in order to
        obtain a child care grant may lead to action being taken under section 16 of the Early Learning and Child Care
        Act. If you are convicted of an offence under section 16, in addition to any punishment imposed, the court may
        order you to pay to the government all or part of any amount you received under the Early Learning and Child
        Care Act as a result of committing the offence.
      </p>
    </template>

    <template v-else-if="isDeclarationBDisplayed">
      <p>
        I do hereby certify that I am the <strong>authorized signing authority</strong> and that all of the information
        provided is true and complete to the best of my knowledge and belief.
      </p>
      <p>
        I consent to the Ministry contacting other branches within the Ministry and other Province ministries to
        validate the accuracy of any information that I have provided.
      </p>
      <p>
        By completing and submitting this Program Confirmation Form (the Form) electronically, I hereby confirm that I
        have carefully read this Form and the corresponding terms and conditions of the Child Care Operating Funding
        Agreement (the Funding Agreement) and that I agree to be bound by such terms and conditions. I further confirm
        that by clicking “I agree” below, I represent and warrant that:
      </p>

      <ol class="declarationBList" type="a">
        <li>
          I am the authorized representative and signing authority of the Provider as named in the Funding Agreement
          (the Provider);
        </li>
        <li>
          I have authority to submit the Form on behalf of the Provider and that by clicking “I agree”, I do hereby bind
          the Provider to the terms and conditions of the Funding Agreement if the Province accepts this Form and enrols
          the Provider in any or all of the Child Care Operating Funding Program, the CCFRI, or the ECE Wage
          Enhancement;
        </li>
        <li>
          All information provided in the Form or otherwise in support of the Provider to receive funding under the
          Funding Agreement is true and complete to the best of my knowledge and belief. I understand and acknowledge
          that providing false or misleading information either on the Form or otherwise to the Province to obtain any
          funding under the Funding Agreement or otherwise failing to comply with the Funding Agreement could result in
          certain penalties or repayment obligations, or both, under any or all of the Early Learning and Child Care
          Act, any successor legislation, or the Funding Agreement;
        </li>
        <li>
          If I have applied for and been approved by the Province to enrol in the ECE Wage Enhancement, the Provider has
          taken all actions required under any collective agreement to which it is a party to ensure it is:
        </li>
      </ol>

      <v-row style="padding-left: 90px">
        <v-col cols="12">
          i. permitted to apply for the ECE Wage Enhancement for any of its unionized Early Childhood Educators (ECEs);
          and
        </v-col>
      </v-row>

      <v-row style="padding-left: 90px">
        <v-col cols="12">
          ii. able to comply with its ECE Wage Enhancement related obligations under the Funding Agreement.
        </v-col>
      </v-row>

      <p class="pt-3">
        I understand and acknowledge that until such time as the Province confirms approval or temporary approval of
        enrolment, in writing, in the CCFRI or the ECE Wage Enhancement, the Provider is not formally enrolled in these
        initiatives. The Province is not responsible for any pre-payments the Provider may make in anticipation of
        enrolment in either of these initiatives and any pre-payments made are at the Provider's own risk.
      </p>
    </template>
  </div>
</template>

<script>
import { mapState } from 'pinia';
import { useSummaryDeclarationStore } from '@/store/summaryDeclaration.js';
import { CHANGE_REQUEST_TYPES } from '@/utils/constants.js';

export default {
  name: 'ChangeRequestDeclarationTextV1',
  props: {
    enabledDeclarationB: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(useSummaryDeclarationStore, ['summaryModel']),
    isDeclarationBDisplayed() {
      return (
        this.enabledDeclarationB ||
        this.summaryModel?.changeRequestTypes?.includes(CHANGE_REQUEST_TYPES.PARENT_FEE_CHANGE)
      );
    },
    isDeclarationADisplayed() {
      return (
        this.summaryModel?.changeRequestTypes?.includes(CHANGE_REQUEST_TYPES.PDF_CHANGE) && !this.enabledDeclarationB
      );
    },
  },
};
</script>

<style scoped>
li {
  padding-bottom: 12px;
}
</style>
