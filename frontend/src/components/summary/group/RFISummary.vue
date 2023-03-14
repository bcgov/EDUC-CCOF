<template>
  <v-row no-gutters class="d-flex flex-column">
    <v-expansion-panel-header>
      <h4 style="color:#003466;">RFI</h4>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row no-gutters class="d-flex">
        <v-col class="col-12 pb-0">
          <span class="summary-label-bold">Exceptional Circumstances</span>
        </v-col>
        <v-col class="col-12">
          <v-row class="d-flex">
            <v-col class="col-6 col-lg-4 py-0">
              <v-row no-gutters>
                <span class="summary-label">Is your fee increase due to an exceptional circumstance?</span>
              </v-row>
              <v-row no-gutters>
                <span class="summary-value-small">{{rfiApp?.exceptionalCircumstances === 1 ? 'YES' : 'NO'}}</span>
              </v-row>
            </v-col>
            <v-col class="col-6 col-lg-4 py-0" v-if="rfiApp?.exceptionalCircumstances">
              <v-row no-gutters>
                <span class="summary-label">Does the exceptional circumstance occur within 6 months of the fee increase?</span>
              </v-row>
              <v-row no-gutters>
                <span class="summary-value-small">{{rfiApp?.circumstanceOccurWithin6Month === 1 ? 'YES' : 'NO'}}</span>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="col-12 py-0" v-if="rfiApp?.exceptionalCircumstances && rfiApp?.circumstanceOccurWithin6Month">
          <v-row no-gutters>
            <v-col class="col-12 py-0">
              <span class="summary-label">Expense Information</span>
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
                  <v-row no-gutters class="d-flex" v-for="(item, index) in rfiApp?.expenseList" :key="index">
                    <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                      <span class="summary-value-small">{{item.description}}</span>
                    </v-col>
                    <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                      <span class="summary-value-small">{{item.date}}</span>
                    </v-col>
                    <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                      <span class="summary-value-small">{{item.frequency}}</span>
                    </v-col>
                    <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                      <span class="summary-value-small">{{item.expense}}</span>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col class="col-12">
                  <v-row no-gutters class="d-flex">
                    <span class="summary-label">Please describe the reason for each expense listed above.</span>
                  </v-row>
                  <v-row no-gutters class="d-flex">
                    <span class="summary-value-small">{{rfiApp?.expenseInformationNote}}</span>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="col-12 py-0" v-if="rfiApp?.exceptionalCircumstances && rfiApp?.circumstanceOccurWithin6Month">
          <v-row no-gutters>
            <v-col class="col-12">
              <span class="summary-label">Other Sources of Ministry Funding</span>
            </v-col>
            <v-col class="col-12">
              <v-row no-gutters class="d-flex">
                <span class="summary-label">Have you applied for any other sources of Ministry Funding (e.g. BC Maintenance Fund, Start-Up Grants) for any of the expenses you listed?</span>
              </v-row>
              <v-row no-gutters class="d-flex">
                <span class="summary-value-small">{{rfiApp?.q3 === 1 ? 'YES' : 'NO'}}</span>
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
              <v-row no-gutters class="d-flex" v-for="(item, index) in rfiApp?.fundingList" :key="index">
                <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                  <span class="summary-value-small">{{item.fundingProgram}}</span>
                </v-col>
                <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                  <span class="summary-value-small">{{item.date}}</span>
                </v-col>
                <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                  <span class="summary-value-small">{{item.status}}</span>
                </v-col>
                <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                  <span class="summary-value-small">{{item.amount}}</span>
                </v-col>
                <v-col class="d-flex justify-start col-2 pa-0 pr-2">
                  <span class="summary-value-small">{{item.expenses}}</span>
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
                <span class="summary-label">Is your fee increase due to a wage increase for Direct Care Staff?</span>
              </v-row>
              <v-row no-gutters class="d-flex">
                <span class="summary-value-small">{{rfiApp?.feeIncreaseDueToWage === 1 ? 'YES' : 'NO'}}</span>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="col-12" v-if="rfiApp?.feeIncreaseDueToWage">
          <v-row no-gutters class="d-flex">
            <v-col class="col-6 col-lg-4 pr-4">
              <v-row no-gutters class="d-flex">
                <span class="summary-label">Was the wage increase committed to (in writing) before the January 2022 release of the Funding Guidelines?</span>
              </v-row>
              <v-row no-gutters class="d-flex">
                <span class="summary-value-small">{{rfiApp?.increaseInWriting === 1 ? 'YES' : 'NO'}}</span>
              </v-row>
            </v-col>
            <v-col class="col-6 col-lg-4 pr-4">
              <v-row no-gutters class="d-flex">
                <span class="summary-label">Is the wage increase part of a collective bargaining agreement for Direct Care Staff at the facility?</span>
              </v-row>
              <v-row no-gutters class="d-flex">
                <span class="summary-value-small">{{rfiApp?.isBargainingAgreement === 1 ? 'YES' : 'NO'}}</span>
              </v-row>
            </v-col>
            <v-col class="col-6 col-lg-4 pr-4">
              <v-row no-gutters class="d-flex">
                <span class="summary-label">Has the facility lost or been unable to hire Direct Care Staff due to current wages?</span>
              </v-row>
              <v-row no-gutters class="d-flex">
                <span class="summary-value-small">{{rfiApp?.lossOfCareStaff === 1 ? 'YES' : 'NO'}}</span>
              </v-row>
            </v-col>
            <v-col class="col-6 col-lg-4 pr-4">
              <v-row no-gutters class="d-flex">
                <span class="summary-label">Is this creating challenges in maintaining the staff-to-child ratios required under the facility licence?</span>
              </v-row>
              <v-row no-gutters class="d-flex">
                <span class="summary-value-small">{{rfiApp?.healthAndSafetyConcerns === 1 ? 'YES' : 'NO'}}</span>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="col-12" v-if="rfiApp?.feeIncreaseDueToWage">
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
          <v-row no-gutters class="d-flex" v-for="(item, index) in rfiApp?.wageList" :key="index">
            <v-col class="d-flex justify-start col-2 pa-0 pr-2">
              <span class="summary-value-small">{{item.staffNumber}}</span>
            </v-col>
            <v-col class="d-flex justify-start col-2 pa-0 pr-2">
              <span class="summary-value-small">{{item.staffRole}}</span>
            </v-col>
            <v-col class="d-flex justify-start col-2 pa-0 pr-2">
              <span class="summary-value-small">{{item.wageBeforeIncrease}}</span>
            </v-col>
            <v-col class="d-flex justify-start col-2 pa-0 pr-2">
              <span class="summary-value-small">{{item.wageAfterIncrease}}</span>
            </v-col>
            <v-col class="d-flex justify-start col-2 pa-0 pr-2">
              <span class="summary-value-small">{{item.averageHours}}</span>
            </v-col>
            <v-col class="d-flex justify-start col-2 pa-0 pr-2">
              <span class="summary-value-small">{{item.wageDate}}</span>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="col-12" v-if="rfiApp?.feeIncreaseDueToWage">
          <v-row no-gutters class="d-flex">
            <v-col class="col-6 col-lg-4 pr-4">
              <v-row no-gutters class="d-flex">
                <span class="summary-label">When did your facility's challenges with hiring and keeping staff begin?</span>
              </v-row>
              <v-row no-gutters class="d-flex">
                <span class="summary-value-small">{{rfiApp?.textbox1}}</span>
              </v-row>
            </v-col>
            <v-col class="col-6 col-lg-4 pr-4">
              <v-row no-gutters class="d-flex">
                <span class="summary-label">How many Direct Care Staff have left your facility due to wages?</span>
              </v-row>
              <v-row no-gutters class="d-flex">
                <span class="summary-value-small">{{rfiApp?.textbox2}}</span>
              </v-row>
            </v-col>
            <v-col class="col-6 col-lg-4 pr-4">
              <v-row no-gutters class="d-flex">
                <span class="summary-label">What have you done to try to recruit staff?</span>
              </v-row>
              <v-row no-gutters class="d-flex">
                <span class="summary-value-small">{{rfiApp?.textbox3}}</span>
              </v-row>
            </v-col>
            <v-col class="col-6 col-lg-4 pr-4">
              <v-row no-gutters class="d-flex">
                <span class="summary-label">Have you had to adjust your hours/days of operation?</span>
              </v-row>
              <v-row no-gutters class="d-flex">
                <span class="summary-value-small">{{rfiApp?.textbox4}}</span>
              </v-row>
            </v-col>
            <v-col class="col-6 col-lg-4 pr-4">
              <v-row no-gutters class="d-flex">
                <span class="summary-label">Is your facility unable to fill spaces due to insufficient staffing?</span>
              </v-row>
              <v-row no-gutters class="d-flex">
                <span class="summary-value-small">{{rfiApp?.textbox5}}</span>
              </v-row>
            </v-col>
            <v-col class="col-6 col-lg-4 pr-4">
              <v-row no-gutters class="d-flex">
                <span class="summary-label">Is there anything else you would like us to know about the wage increase(s)?</span>
              </v-row>
              <v-row no-gutters class="d-flex">
                <span class="summary-value-small">{{rfiApp?.textbox6}}</span>
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
                <span class="summary-label">Is your fee increase due to expanding or extending the hours of child care service available for all enrolled children?</span>
              </v-row>
              <v-row no-gutters class="d-flex">
                <span class="summary-value-small">{{rfiApp?.feeIncreaseExtendedHours === 1 ? 'YES' : 'NO'}}</span>
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
          <v-row no-gutters class="d-flex" v-for="(item, index) in rfiApp?.expansionList" :key="index">
            <v-col class="d-flex justify-start col-3 pa-0 pr-2">
              <v-row no-gutters class="d-flex">
                <v-col class="d-flex justify-start col-6 pt-0 pa-0 pr-2">
                  <span class="summary-value-small">{{item.timefrom}}</span>
                </v-col>
                <v-col class="d-flex justify-start col-6 pt-0 pa-0 pr-2">
                  <span class="summary-value-small">{{item.timeto}}</span>
                </v-col>
              </v-row>
            </v-col>
            <v-col class="d-flex justify-start col-3 pa-0 pr-2">
              <v-row no-gutters class="d-flex">
                <v-col class="d-flex justify-start col-6 pt-0 pa-0 pr-2">
                  <span class="summary-value-small">{{item.newtimefrom}}</span>
                </v-col>
                <v-col class="d-flex justify-start col-6 pt-0 pa-0 pr-2">
                  <span class="summary-value-small">{{item.newtimeto}}</span>
                </v-col>
              </v-row>
            </v-col>
            <v-col class="d-flex justify-start col-2 pa-0 pr-2">
              <v-row no-gutters class="d-flex">
                <span class="summary-value-small">{{item.date}}</span>
              </v-row>
            </v-col>
            <v-col class="d-flex justify-start col-2 pa-0 pr-2">
              <span class="summary-value-small">{{item.expense}}</span>
            </v-col>
            <v-col class="d-flex justify-start col-2 pa-0 pr-2">
              <span class="summary-value-small">{{item.frequency}}</span>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="col-12" v-if="rfiApp?.feeIncreaseExtendedHours">
          <v-row no-gutters class="d-flex">
            <v-col class="col-6 col-lg-4 pr-4">
              <v-row no-gutters class="d-flex">
                <span class="summary-label">Describe each of your expenses above. (e.g. Wages, Utilities)</span>
              </v-row>
              <v-row no-gutters class="d-flex">
                <span class="summary-value-small">{{rfiApp?.serviceExpansionDetailsNote}}</span>
              </v-row>
            </v-col>
            <v-col class="col-6 col-lg-4 pr-4">
              <v-row no-gutters class="d-flex">
                <span class="summary-label pr-2">Is there anything else about your change in hours of operation you would like us to know?</span>
              </v-row>
              <v-row no-gutters class="d-flex">
                <span class="summary-value-small">{{rfiApp?.notes2}}</span>
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
                <span class="summary-label">Is your fee increase due to an increased connection to Indigenous community, culture, or language for all enrolled children in a Facility owned, managed, or governed by at least 51% Indigenous peoples?</span>
              </v-row>
              <v-row no-gutters class="d-flex">
                <span class="summary-value-small">{{rfiApp?.IndigenousConnection === 1 ? 'YES' : 'NO'}}</span>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="col-12" v-if="rfiApp?.IndigenousConnection">
          <v-row no-gutters class="d-flex">
            <v-col class="col-12">
              <span class="summary-label">Expense Information</span>
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
              <v-row no-gutters class="d-flex" v-for="(item, index) in rfiApp?.indigenousExpenseList" :key="index">
                <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                  <v-row no-gutters class="d-flex">
                    <span class="summary-value-small">{{item.description}}</span>
                  </v-row>
                </v-col>
                <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                  <v-row no-gutters class="d-flex">
                    <span class="summary-value-small">{{item.date}}</span>
                  </v-row>
                </v-col>
                <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                  <span class="summary-value-small">{{item.frequency}}</span>
                </v-col>
                <v-col class="d-flex justify-start col-3 pa-0 pr-2">
                  <span class="summary-value-small">{{item.expense}}</span>
                </v-col>
              </v-row>
            </v-col>
            <v-col class="col-12 col-lg-4 pr-4">
              <v-row no-gutters class="d-flex">
                <v-col class="col-12">
                  <v-row no-gutters class="d-flex">
                    <span class="summary-label">Is there anything else about your expenses you would like us to know?</span>
                  </v-row>
                  <v-row no-gutters class="d-flex">
                    <span class="summary-value-small">{{rfiApp?.iCEIDetailsNote}}</span>
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
              </v-row>
              <v-row no-gutters class="d-flex">
                <span class="summary-value-small">{{rfiApp?.underservedPop === 1 ? 'YES' : 'NO'}}</span>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
        <v-col class="col-12" v-if="rfiApp?.underservedPop">
          <v-row no-gutters class="d-flex">
            <v-col class="col-6 col-lg-4 pr-4">
              <v-row no-gutters class="d-flex">
                <span class="summary-label">Please describe how the majority of children you provide care for represent an underserved population (e.g. indigenous children, low-income families?)</span>
              </v-row>
              <v-row no-gutters class="d-flex">
                <span class="summary-value-small">{{rfiApp?.underservedChildCareTypes}}</span>
              </v-row>
            </v-col>
            <v-col class="col-6 col-lg-4 pr-4">
              <v-row no-gutters class="d-flex">
                <span class="summary-label">How will your fee increase contribute to the overall sustainability of the organization/facility?</span>
              </v-row>
              <v-row no-gutters class="d-flex">
                <span class="summary-value-small">{{rfiApp?.orgsustainability}}</span>
              </v-row>
            </v-col>
            <v-col class="col-6 col-lg-4 pr-4">
              <v-row no-gutters class="d-flex">
                <span class="summary-label">Describe whether parents' out-of-pocket monthly cost for child care will be affected by this increase (after applying reductions from CCFRI and the Affordable Child Care Benefit, and any other applicable funding source). Will any families experience a cost increase, and if so, by how much?</span>
              </v-row>
              <v-row no-gutters class="d-flex">
                <span class="summary-value-small">{{rfiApp?.outOfPocketFees}}</span>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-expansion-panel-content>
  </v-row>
</template>
<script>

export default {
  name: 'RFISummary',
  props: {
    rfiApp: {
      type: Object,
      required: true
    },
  },
};
</script>
<style>
.summary-label {
  color: grey;
  font-size: small;
}

.summary-value {
  font-size: medium;
  color: black;
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
.summary-value-small{
  color: black;
  font-size: small;
  font-weight: bold
}
</style>

