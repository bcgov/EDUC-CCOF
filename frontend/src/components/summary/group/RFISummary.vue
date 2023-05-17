<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-form ref="rfiSummaryForm" v-model="isValidForm">
      <v-expansion-panel-header>
        <h4 style="color:#003466;">RFI
          <v-icon v-if="isValidForm" color="green" large>mdi-check-circle-outline</v-icon>
          <v-icon v-if="!isValidForm" color="#ff5252" large>mdi-alert-circle-outline</v-icon>
          <span v-if="!isValidForm" style="color:#ff5252;">Your form is missing required information. Click here to view.</span>
        </h4>
      </v-expansion-panel-header>
      <v-expansion-panel-content eager   class="ml-2 mt-2">
        <v-row no-gutters class="d-flex ">
          <v-col class="col-12 pb-0">
            <span class="summary-label-bold">Exceptional Circumstances</span>
          </v-col>
          <v-col class="col-12">
            <v-row class="d-flex">
              <v-col class="col-6 py-0">
                <v-row no-gutters>
                  <span class="summary-label pt-3">Is your fee increase due to an exceptional circumstance?</span>
                  <v-text-field placeholder="Required" class="summary-value" :value="getValueString(rfiApp?.exceptionalCircumstances)" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                </v-row>
              </v-col>
              <v-col class="col-6 py-0" v-if="rfiApp?.exceptionalCircumstances">
                <v-row no-gutters>
                  <span class="summary-label pt-3">Does the exceptional circumstance occur within 6 months of the fee increase?</span>
                  <v-text-field placeholder="Required" class="summary-value" :value="getValueString(rfiApp?.circumstanceOccurWithin6Month)" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="col-12 py-0" v-if="rfiApp?.exceptionalCircumstances == 1 && rfiApp?.circumstanceOccurWithin6Month == 1">
            <v-row no-gutters>
              <v-col class="col-12 py-2">
                <span class="summary-label-bold">Expense Information</span>
              </v-col>
              <v-col class="col-12 py-0">
                <v-row no-gutters class="d-flex">
                  <v-col class="col-12 py-0">
                    <v-row no-gutters class="d-flex">
                      <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                        <span class="summary-label">Expense Description</span>
                      </v-col>
                      <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                        <span class="summary-label">Date of expense</span>
                      </v-col>
                      <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                        <span class="summary-label">Payment frequency details</span>
                      </v-col>
                      <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                        <span class="summary-label">Expense amount</span>
                      </v-col>
                    </v-row>
                    <v-row no-gutters class="d-flex" v-if="rfiApp?.expenseList.length == 0" >
                      <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                        <v-text-field placeholder="Required" class="summary-value" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                      </v-col>
                      <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                        <v-text-field placeholder="Required" class="summary-value"  dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                      </v-col>
                      <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                        <v-text-field placeholder="Required" class=" summary-value"  dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                      </v-col>
                      <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                        <v-text-field placeholder="Required" class=" summary-value"  dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row no-gutters class="d-flex" v-else v-for="(item, index) in rfiApp?.expenseList" :key="index">
                      <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                        <v-text-field placeholder="Required" class="summary-value" :value="item.description" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                      </v-col>
                      <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                        <v-text-field placeholder="Required" class="summary-value" :value="item.date" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                      </v-col>
                      <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                        <v-text-field placeholder="Required" class=" summary-value" :value="item.frequency" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                      </v-col>
                      <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                        <v-text-field placeholder="Required" class=" summary-value" :value="item.expense" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col class="col-12">
                    <v-row no-gutters class="d-flex">
                      <span class="summary-label pt-3">Please describe the reason for each expense listed above.</span>
                      <v-textarea placeholder="Required" class="col-12" :value="rfiApp?.expenseInformationNote" dense flat solo hide-details readonly no-resize rows="3" :rules="rules.required" ></v-textarea>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="col-12 py-0" v-if="rfiApp?.exceptionalCircumstances && rfiApp?.circumstanceOccurWithin6Month">
            <v-row no-gutters>
              <v-col class="col-12">
                <span class="summary-label-bold">Other Sources of Ministry Funding</span>
              </v-col>
              <v-col class="col-12">
                <v-row no-gutters class="d-flex">
                  <span class="summary-label pt-3">Have you applied for any other sources of Ministry Funding (e.g. BC Maintenance Fund, Start-Up Grants) for any of the expenses you listed?</span>
                  <v-text-field placeholder="Required" class=" summary-value" :value="getValueString(rfiApp?.q3)" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                </v-row>
              </v-col>
              <v-col class="col-12" v-if="rfiApp?.q3">
                <v-row no-gutters class="d-flex">
                  <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                    <span class="summary-label">Funding Program</span>
                  </v-col>
                  <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                    <span class="summary-label">Application Date</span>
                  </v-col>
                  <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                    <span class="summary-label">Status of Application</span>
                  </v-col>
                  <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                    <span class="summary-label">Amount Received</span>
                  </v-col>
                  <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                    <span class="summary-label">Expense(s)</span>
                  </v-col>
                </v-row>
                <v-row no-gutters class="d-flex" v-if="rfiApp?.fundingList.length == 0">
                  <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                    <v-text-field placeholder="Required" class=" summary-value"  dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                  </v-col>
                  <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                    <v-text-field placeholder="Required" class=" summary-value"  dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                  </v-col>
                  <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                    <v-text-field placeholder="Required" class=" summary-value"  dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                  </v-col>
                  <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                    <v-text-field placeholder="Required" class=" summary-value"  dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                  </v-col>
                  <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                    <v-text-field placeholder="Required" class=" summary-value" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                  </v-col>
                </v-row>
                <v-row no-gutters class="d-flex" v-else v-for="(item, index) in rfiApp?.fundingList" :key="index">
                  <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                    <v-text-field placeholder="Required" class=" summary-value" :value="item.fundingProgram" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                  </v-col>
                  <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                    <v-text-field placeholder="Required" class=" summary-value" :value="item.date" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                  </v-col>
                  <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                    <v-text-field placeholder="Required" class=" summary-value" :value="item.status" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                  </v-col>
                  <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                    <v-text-field placeholder="Required" class=" summary-value" :value="item.amount" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                  </v-col>
                  <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                    <v-text-field placeholder="Required" class=" summary-value" :value="item.expenses" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row no-gutters class="d-flex pt-2">
          <v-col class="col-12">
            <span class="summary-label-bold">Direct Care Staff Wages Increases</span>
          </v-col>
          <v-col class="col-12">
            <v-row no-gutters class="d-flex">
              <v-col class="col-12">
                <v-row no-gutters class="d-flex">
                  <span class="summary-label pt-3">Is your fee increase due to a wage increase for Direct Care Staff?</span>
                  <v-text-field placeholder="Required" class="summary-value" :value="getValueString(rfiApp?.feeIncreaseDueToWage)" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="col-12" v-if="rfiApp?.feeIncreaseDueToWage">
            <v-row no-gutters class="d-flex">
              <v-col class="col-6 pr-4">
                <v-row no-gutters class="d-flex">
                  <span class="summary-label pt-3">Was the wage increase committed to (in writing) before the January 2022 release of the Funding Guidelines?</span>
                  <v-text-field placeholder="Required" class="summary-value" :value="getValueString(rfiApp?.increaseInWriting)" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                </v-row>
              </v-col>
              <v-col class="col-6 pr-4">
                <v-row no-gutters class="d-flex">
                  <span class="summary-label pt-3">Is the wage increase part of a collective bargaining agreement for Direct Care Staff at the facility?</span>
                  <v-text-field placeholder="Required" class="summary-value" :value="getValueString(rfiApp?.isBargainingAgreement)" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                </v-row>
              </v-col>
              <v-col class="col-6 pr-4">
                <v-row no-gutters class="d-flex">
                  <span class="summary-label pt-3">Has the facility lost or been unable to hire Direct Care Staff due to current wages?</span>
                  <v-text-field placeholder="Required" class=" summary-value" :value="getValueString(rfiApp?.lossOfCareStaff)" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                </v-row>
              </v-col>
              <v-col class="col-6 pr-4">
                <v-row no-gutters class="d-flex">
                  <span class="summary-label pt-3">Is this creating challenges in maintaining the staff-to-child ratios required under the facility licence?</span>
                  <v-text-field placeholder="Required" class=" summary-value" :value="getValueString(rfiApp?.healthAndSafetyConcerns)" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="col-12" v-if="rfiApp?.feeIncreaseDueToWage == 1">
            <v-row no-gutters class="d-flex">
              <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                <span class="summary-label">Number of staff receiving wage increase</span>
              </v-col>
              <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                <span class="summary-label">Direct Care staff role</span>
              </v-col>
              <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                <span class="summary-label">Wage before increase</span>
              </v-col>
              <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                <span class="summary-label">Wage after increase</span>
              </v-col>
              <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                <span class="summary-label">Average hours per week at this facility</span>
              </v-col>
              <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                <span class="summary-label">Date</span>
              </v-col>
            </v-row>
            <v-row no-gutters class="d-flex" v-if="rfiApp?.wageList.length == 0" >
              <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                <v-text-field placeholder="Required" class=" summary-value"  dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
              </v-col>
              <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                <v-text-field placeholder="Required" class=" summary-value"  dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
              </v-col>
              <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                <v-text-field placeholder="Required" class=" summary-value"  dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
              </v-col>
              <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                <v-text-field placeholder="Required" class=" summary-value"  dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
              </v-col>
              <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                <v-text-field placeholder="Required" class=" summary-value"  dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
              </v-col>
              <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                <v-text-field placeholder="Required" class=" summary-value"  dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
              </v-col>
            </v-row>
            <v-row no-gutters class="d-flex" v-else v-for="(item, index) in rfiApp?.wageList" :key="index">
              <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                <v-text-field placeholder="Required" class=" summary-value" :value="item.staffNumber" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
              </v-col>
              <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                <v-text-field placeholder="Required" class=" summary-value" :value="item.staffRole" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
              </v-col>
              <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                <v-text-field placeholder="Required" class=" summary-value" :value="item.wageBeforeIncrease" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
              </v-col>
              <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                <v-text-field placeholder="Required" class=" summary-value" :value="item.wageAfterIncrease" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
              </v-col>
              <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                <v-text-field placeholder="Required" class=" summary-value" :value="item.averageHours" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
              </v-col>
              <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                <v-text-field placeholder="Required" class=" summary-value" :value="item.wageDate" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="col-12" v-if="rfiApp?.feeIncreaseDueToWage">
            <v-row no-gutters class="d-flex">
              <v-col class="col-6 pr-4">
                <v-row no-gutters class="d-flex">
                  <span class="summary-label pt-3">When did your facility's challenges with hiring and keeping staff begin?</span>
                  <v-textarea placeholder="Required" class="col-12  summary-value" :value="rfiApp?.textbox1" dense flat solo hide-details readonly no-resize rows="3"  required :rules="rules.required" ></v-textarea>
                </v-row>
              </v-col>
              <v-col class="col-6 pr-4">
                <v-row no-gutters class="d-flex">
                  <span class="summary-label pt-3">How many Direct Care Staff have left your facility due to wages?</span>
                  <v-textarea placeholder="Required" class="col-12  summary-value"  :value="rfiApp?.textbox2" dense flat solo hide-details no-resize rows="3" required :rules="rules.required" ></v-textarea>
                </v-row>
              </v-col>
              <v-col class="col-6 pr-4">
                <v-row no-gutters class="d-flex">
                  <span class="summary-label pt-3">What have you done to try to recruit staff?</span>
                  <v-textarea placeholder="Required" class="col-12  summary-value"  :value="rfiApp?.textbox3" dense flat solo hide-details  no-resize rows="3" required :rules="rules.required" ></v-textarea>
                </v-row>
              </v-col>
              <v-col class="col-6 pr-4">
                <v-row no-gutters class="d-flex">
                  <span class="summary-label pt-3">Have you had to adjust your hours/days of operation?</span>
                  <v-textarea placeholder="Required" class="col-12  summary-value"  :value="rfiApp?.textbox4" dense flat solo hide-details no-resize rows="3" required :rules="rules.required" ></v-textarea>
                </v-row>
              </v-col>
              <v-col class="col-6 pr-4">
                <v-row no-gutters class="d-flex">
                  <span class="summary-label pt-3">Is your facility unable to fill spaces due to insufficient staffing?</span>
                  <v-textarea placeholder="Required" class="col-12  summary-value"  :value="rfiApp?.textbox5" dense flat solo hide-details no-resize rows="3" required :rules="rules.required" ></v-textarea>
                </v-row>
              </v-col>
              <v-col class="col-6 pr-4">
                <v-row no-gutters class="d-flex">
                  <span class="summary-label pt-3">Is there anything else you would like us to know about the wage increase(s)?</span>
                  <v-textarea placeholder="Required" class="col-12  summary-value"  :value="rfiApp?.textbox6" dense flat solo hide-details no-resize rows="3" required :rules="rules.required" ></v-textarea>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row no-gutters class="d-flex pt-2">
          <v-col class="col-12">
            <span class="summary-label-bold">Priority Service Expansion: Increase in Hours of Operation</span>
          </v-col>
          <v-col class="col-12">
            <v-row no-gutters class="d-flex">
              <v-col class="col-12">
                <v-row no-gutters class="d-flex">
                  <span class="summary-label pt-3">Is your fee increase due to expanding or extending the hours of child care service available for all enrolled children?</span>
                  <v-text-field placeholder="Required" class=" summary-value" :value="getValueString(rfiApp?.feeIncreaseExtendedHours)" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="col-12" v-if="rfiApp?.feeIncreaseExtendedHours">
            <v-row no-gutters class="d-flex">
              <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                <span class="summary-label">Facility's previous hours of operation</span>
              </v-col>
              <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                <span class="summary-label">Facility's new hours of operation</span>
              </v-col>
              <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                <span class="summary-label">Date of Change</span>
              </v-col>
              <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                <span class="summary-label">Amount of Expense</span>
              </v-col>
              <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                <span class="summary-label">Payment frequency</span>
              </v-col>
            </v-row>
            <v-row no-gutters class="d-flex">
              <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                <v-row no-gutters class="d-flex">
                  <v-col class="d-flex justify-start col-6 pt-0 pa-0 pr-2">
                    <span class="summary-label">From</span>
                  </v-col>
                  <v-col class="d-flex justify-start col-6 pt-0 pa-0 pr-2">
                    <span class="summary-label">To</span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                <v-row no-gutters class="d-flex">
                  <v-col class="d-flex justify-start col-6 pt-0 pa-0 pr-2">
                    <span class="summary-label">From</span>
                  </v-col>
                  <v-col class="d-flex justify-start col-6 pt-0 pa-0 pr-2">
                    <span class="summary-label">To</span>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row no-gutters class="d-flex" v-if = " rfiApp?.expansionList.length == 0" >
              <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                <v-row no-gutters class="d-flex">
                  <v-col class="d-flex justify-start col-6 pt-0 pa-0 pr-2">
                    <v-text-field placeholder="Required" class=" summary-value"  dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                  </v-col>
                  <v-col class="d-flex justify-start col-6 pt-0 pa-0 pr-2">
                    <v-text-field placeholder="Required" class=" summary-value"  dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                <v-row no-gutters class="d-flex">
                  <v-col class="d-flex justify-start col-6 pt-0 pa-0 pr-2">
                    <v-text-field placeholder="Required" class=" summary-value"  dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                  </v-col>
                  <v-col class="d-flex justify-start col-6 pt-0 pa-0 pr-2">
                    <v-text-field placeholder="Required" class=" summary-value"  dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                <v-row no-gutters class="d-flex">
                  <v-text-field placeholder="Required" class=" summary-value"  dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                </v-row>
              </v-col>
              <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                <v-text-field placeholder="Required" class=" summary-value"  dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
              </v-col>
              <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                <v-text-field placeholder="Required" class=" summary-value"  dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
              </v-col>
            </v-row>
            <v-row no-gutters class="d-flex" v-else v-for="(item, index) in rfiApp?.expansionList" :key="index">
              <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                <v-row no-gutters class="d-flex">
                  <v-col class="d-flex justify-start col-6 pt-0 pa-0 pr-2">
                    <v-text-field placeholder="Required" class=" summary-value" :value="item.timefrom" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                  </v-col>
                  <v-col class="d-flex justify-start col-6 pt-0 pa-0 pr-2">
                    <v-text-field placeholder="Required" class=" summary-value" :value="item.timeto" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                <v-row no-gutters class="d-flex">
                  <v-col class="d-flex justify-start col-6 pt-0 pa-0 pr-2">
                    <v-text-field placeholder="Required" class=" summary-value" :value="item.newtimefrom" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                  </v-col>
                  <v-col class="d-flex justify-start col-6 pt-0 pa-0 pr-2">
                    <v-text-field placeholder="Required" class=" summary-value" :value="item.newtimeto" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                <v-row no-gutters class="d-flex">
                  <v-text-field placeholder="Required" class=" summary-value" :value="item.date" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                </v-row>
              </v-col>
              <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                <v-text-field placeholder="Required" class=" summary-value" :value="item.expense" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
              </v-col>
              <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                <v-text-field placeholder="Required" class=" summary-value" :value="item.frequency" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="col-12" v-if="rfiApp?.feeIncreaseExtendedHours">
            <v-row no-gutters class="d-flex">
              <v-col class="col-6 pr-4">
                <v-row no-gutters class="d-flex">
                  <span class="summary-label pt-3">Describe each of your expenses above. (e.g. Wages, Utilities)</span>
                  <v-textarea placeholder="Required" class="col-12  summary-value"  :value="rfiApp?.serviceExpansionDetailsNote" dense flat solo hide-details no-resize rows="3" required :rules="rules.required" ></v-textarea>
                </v-row>
              </v-col>
              <v-col class="col-6 pr-4">
                <v-row no-gutters class="d-flex">
                  <span class="summary-label pt-3">Is there anything else about your change in hours of operation you would like us to know?</span>
                  <v-textarea placeholder="Required" class="col-12  summary-value"  :value="rfiApp?.notes2" dense flat solo hide-details no-resize rows="3" required :rules="rules.required" ></v-textarea>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row no-gutters class="d-flex pt-2">
          <v-col class="col-12">
            <span class="summary-label-bold">Priority Service Expansion: Increased Connection to Indigenous Community, Culture, and/or Language</span>
          </v-col>
          <v-col class="col-12">
            <v-row no-gutters class="d-flex">
              <v-col class="col-12">
                <v-row no-gutters class="d-flex">
                  <span class="summary-label pt-3">Is your fee increase due to an increased connection to Indigenous community, culture, or language for all enrolled children in a Facility owned, managed, or governed by at least 51% Indigenous peoples?</span>
                  <v-text-field placeholder="Required" class=" summary-value" :value="getValueString(rfiApp?.IndigenousConnection)" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="col-12" v-if="rfiApp?.IndigenousConnection">
            <v-row no-gutters class="d-flex">
              <v-col class="col-12">
                <span class="summary-label-bold">Expense Information</span>
              </v-col>
              <v-col class="col-12 col-lg-8">
                <v-row no-gutters class="d-flex">
                  <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                    <span class="summary-label">Expense Description</span>
                  </v-col>
                  <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                    <span class="summary-label">Date of expense</span>
                  </v-col>
                  <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                    <span class="summary-label">Payment frequency details</span>
                  </v-col>
                  <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                    <span class="summary-label">Expense amount</span>
                  </v-col>
                </v-row>
                <v-row no-gutters class="d-flex" v-if = "rfiApp?.indigenousExpenseList.length == 0" >
                  <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                    <v-row no-gutters class="d-flex">
                      <v-text-field placeholder="Required" class=" summary-value"  dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                    </v-row>
                  </v-col>
                  <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                    <v-row no-gutters class="d-flex">
                      <v-text-field placeholder="Required" class=" summary-value"  dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                    </v-row>
                  </v-col>
                  <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                    <v-text-field placeholder="Required" class=" summary-value"  dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                  </v-col>
                  <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                    <v-text-field placeholder="Required" class=" summary-value"  dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                  </v-col>
                </v-row>
                <v-row no-gutters class="d-flex" v-else v-for="(item, index) in rfiApp?.indigenousExpenseList" :key="index">
                  <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                    <v-row no-gutters class="d-flex">
                      <v-text-field placeholder="Required" class=" summary-value" :value="item.description" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                    </v-row>
                  </v-col>
                  <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                    <v-row no-gutters class="d-flex">
                      <v-text-field placeholder="Required" class=" summary-value" :value="item.date" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                    </v-row>
                  </v-col>
                  <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                    <v-text-field placeholder="Required" class=" summary-value" :value="item.frequency" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                  </v-col>
                  <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                    <v-text-field placeholder="Required" class=" summary-value" :value="item.expense" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="col-12 col-lg-4 pr-4">
                <v-row no-gutters class="d-flex">
                  <v-col class="col-12">
                    <v-row no-gutters class="d-flex">
                      <span class="summary-label">Is there anything else about your expenses you would like us to know?</span>
                      <v-textarea placeholder="Required" class="col-12  summary-value"  :value="rfiApp?.iCEIDetailsNote" dense flat solo hide-details no-resize rows="3" required :rules="rules.required" ></v-textarea>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row no-gutters class="d-flex pt-2">
          <v-col class="col-12">
            <span class="summary-label-bold">Affordable Child Care for Underserved Populations</span>
          </v-col>
          <v-col class="col-12">
            <v-row no-gutters class="d-flex">
              <v-col class="col-12">
                <v-row no-gutters class="d-flex">
                  <span class="summary-label">Does this Facility meet all the above criteria?</span>
                  <br>
                  <v-text-field placeholder="Required" class=" summary-value col-12" :value="getValueString(rfiApp?.underservedPop)" dense flat solo hide-details  required :rules="rules.required" ></v-text-field>
                </v-row>
              </v-col>
            </v-row>
          </v-col>
          <v-col class="col-12" v-if="rfiApp?.underservedPop">
            <v-row no-gutters class="d-flex">

                <v-row no-gutters class="d-flex">
                  <span class="summary-label">Please describe how the majority of children you provide care for represent an underserved population (e.g. indigenous children, low-income families?)</span>
                  <v-textarea placeholder="Required" class="col-12  summary-value" :value="rfiApp?.underservedChildCareTypes" dense flat solo hide-details no-resize rows="3" required :rules="rules.required" ></v-textarea>
                </v-row>


                <v-row no-gutters class="d-flex">
                  <span class="summary-label">How will your fee increase contribute to the overall sustainability of the organization/facility?</span>
                  <v-textarea placeholder="Required" class="col-12  summary-value"  :value="rfiApp?.orgsustainability" dense flat solo hide-details no-resize rows="3" required :rules="rules.required" ></v-textarea>
                </v-row>


                <v-row no-gutters class="d-flex">
                  <span class="summary-label">Describe whether parents' out-of-pocket monthly cost for child care will be affected by this increase (after applying reductions from CCFRI and the Affordable Child Care Benefit, and any other applicable funding source). Will any families experience a cost increase, and if so, by how much?</span>
                  <v-textarea placeholder="Required" class="col-12  summary-value"  :value="rfiApp?.outOfPocketFees" dense flat solo hide-details no-resize rows="3" required :rules="rules.required" ></v-textarea>
                </v-row>

            </v-row>
          </v-col>
        </v-row>
        <v-row v-if="!isValidForm" class="d-flex justify-start">
          <v-col cols="6" lg="4" class="pb-0 pt-0">
            <v-row  no-gutters class="d-flex justify-start">
              <v-col cols="12" class="d-flex justify-start">
                <router-link :to="PATHS.ccfriRequestMoreInfo + '/' + ccfriId " > <span style="color:#D40D19; text-underline: black"><u>To add this information, click here. This will bring you to a different page.</u></span></router-link>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-form>
  </v-row>
</template>
<script>
import {PATHS} from '@/utils/constants';
import rules from '@/utils/rules';

export default {
  name: 'RFISummary',
  props: {
    rfiApp: {
      type: Object,
      required: true
    },
    ccfriId: {
      type: String,
      required: true
    },
    facilityId: {
      type: String,
      required: false
    },
  },
  data() {
    return {
      PATHS,
      rules,
      isValidForm: true,
      formObj:{
        formName: 'RFISummary',
        formId: this.facilityId,
      }
    };
  },
  methods: {
    getValueString(val){
      if (val === 1){
        return 'YES';
      }
      else if (val === 0){
        return 'NO';
      }

      return val;
    }
  },
  mounted() {
    this.$emit('isSummaryValid', this.formObj, this.isValidForm);
  },
  watch: {
    isValidForm: {
      handler: function (val) {
        this.$emit('isSummaryValid',this.formObj, val);
      },
    }
  },
};
</script>
<style scoped>
.summary-label {
  color: grey;
  font-size: small;
}

.summary-value {
  font-size: medium;
  color: black;
}
>>>::placeholder {
  color: #ff5252!important;
  opacity: 1;
}

.summary-label-smaller {
  color: grey;
  font-size: x-small;
}

.summary-label-bold {
  color: black;
  font-size: small;
  font-style: initial;
}
. summary-value{
  color: black;
  font-size: small !important;
  font-weight: bold !important;
}
</style>

