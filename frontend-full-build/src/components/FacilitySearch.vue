<template>
  <v-container>
    <v-row justify="center">
        <v-col cols="10">
        <v-card elevation="4" class="pa-0" color="#D4EAFF" style="">
            <v-row>
            <v-col style="padding-top:0%;padding-bottom:0px;">
                <v-card-title style="color:#39598A;font-style:normal;font-weight:700;font-family:Inter;font-size:20px">Optional Facility Search:</v-card-title>
            </v-col>
            </v-row>
            <v-row>
            <v-col cols="12" style="padding-top:0%;padding-bottom:0px;">
                <div style="padding-left:24px;color:#39598A;font-style:normal;font-weight:500;font-family:Inter;font-size:16px">
                Search by city or name of a licensed child care provider
                </div>
            </v-col>
            </v-row>
            <v-row>
            <v-col cols="8" style="padding-left:34px;">
                <v-text-field
                background-color="white"
                dense
                hint="Type your keyword here"
                persistent-hint="true"
                v-model="form.careProviderSearch"
                v-on="on"
                outlined
                >
                </v-text-field>
            </v-col>
            <v-col>
                <v-dialog
                v-model="dialog"
                persistent
                max-width="800px"
                @click:outside="dialog = false">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn style="font-style:normal;font-weight:700;font-family:Inter;font-size:16px;padding-left:24px;padding-right:24px;"
                    color="#39598A"
                    dark
                    v-bind="attrs"
                    v-on="on"
                    @click="selectedRow = []">
                    Search
                    </v-btn>
                </template>
                <v-card>
                    <v-container style="padding-top:0px;">
                    <v-row>
                        <v-col cols="12" style="padding-bottom:42px;background-color:#234075;"></v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" style="background-color:#FFC72C;padding:3px;"></v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" style="padding-left:24px;">
                        <div style="color:#39598A;font-style:normal;font-weight:700;font-family:Inter;font-size:20px">
                            Search Facilities
                        </div>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" style="padding-left:24px;padding-bottom:0px;">
                        <v-text-field
                            v-model="number"
                            v-on="on"
                            outlined
                            required
                            dense
                            append-outer-icon="mdi-magnify">
                        </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" style="padding-top:0px;">
                        <v-data-table
                            :headers="headers"
                            :items="facilities"
                            item-key="name"
                            :items-per-page="5"
                            hide-default-header
                            v-model="selectedRow"
                        >
                            <template v-slot:item="{ item }">
                            <tr :class="selectedRow.indexOf(item.name)>-1?'grey':''" @click="rowClicked(item);dialog=false">
                                <td style="padding-bottom:10px;padding-top:10px;">
                                <span style="font-weight:600;color:#336799;font-size:16px;font-family:Inter;">{{ item.name }}</span>
                                <br>
                                <span style="font-weight:600;color: #000;font-size:14px;font-family:Inter;">City: </span>{{ item.city }}
                                </td>
                                <td align="right">
                                <v-btn style="font-style:normal;font-weight:500;font-family:Inter;font-size:14px;padding-left:24px;padding-right:24px;"
                                    color="#39598A"
                                    dark
                                    v-bind="attrs"
                                    v-on="on"
                                    @click="rowClicked(item);dialog=false">
                                    Select
                                </v-btn>
                                </td>
                            </tr>
                            </template>
                        </v-data-table>
                        </v-col>
                    </v-row>
                    </v-container>

                </v-card>
                </v-dialog>

            </v-col>
            </v-row>
        </v-card>
        </v-col>
    </v-row>
    <v-row>
      <v-col></v-col>
    </v-row>
    <!--v-menu v-model="menu2"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto">
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="form.month"
          readonly
          v-bind="attrs"
          v-on="on"
          outlined
          required
          :rules="rulesMonth"
          dense>
        </v-text-field>
      </template>
      <v-date-picker
        v-model="form.month"
        @input="menu2 = false">
      </v-date-picker>
    </v-menu-->    
  </v-container>
</template>

<script>
/* Data related to facility search. Comment out until we are ready to integration with backend. Similiarly there is commented out methods related.
dialogSearch: '',
headers: [
{
    text: '',
    align: 'start',
    sortable: false,
    value: 'name',
}
],
selectedRow: [],
facilities: [
{
    name: 'ABC Vancouver',
    city: 'Vancouver',
    typeOfCare: 'Group',
    approvedParentFee: 200
},
{
    name: 'ABC Family Daycare',
    city: 'Vancouver',
    typeOfCare: 'Family',
    approvedParentFee: 275
},
{
    name: 'ABC Daycare',
    city: 'North Vancouver',
    typeOfCare: 'Group',
    approvedParentFee: 250
},
{
    name: 'XYZ Daycare',
    city: 'North Vancouver',
    typeOfCare: 'Group',
    approvedParentFee: 175
},
{
    name: 'XYZ Tottler Care',
    city: 'Maple Ridge',
    typeOfCare: 'Family',
    approvedParentFee: 300
},
{
    name: 'XYZ Child Daycare',
    city: 'Maple Ridge',
    typeOfCare: 'Group)',
    approvedParentFee: 250
},
{
    name: 'XYZ Family Daycare',
    city: 'Delta',
    typeOfCare: 'Family',
    approvedParentFee: 200
},
],*/
</script>
