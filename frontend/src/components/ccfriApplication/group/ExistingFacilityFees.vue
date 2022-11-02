<template>
  <container>
      <v-card elevation="6" class="pa-4 mx-auto my-10 rounded-lg col-12 "
          min-height="230"
          rounded
          tiled
          exact tile
          :ripple="false"
          >
            <v-card-text>
              <p class="text-h5 text--primary text-center">
                Facility A
              </p>
              <p class="text-h6 text--primary text-center">
                Our Records show this facilites' fees for April 2021 to March 2022 are: 
              </p>
              <p>
                Lorem ipsum dolor sit
              </p>
              <br>
              <v-simple-table>
                <thead>
                  <tr>
                    <th  scope="col" class="text-left">
                      Date
                    </th>
                    <th  scope="col" class="text-center">
                      Full-Time 18-36 Months
                    </th>
                    <th  scope="col" class="text-center">
                      Full-Time 3 Years to Kindergarten
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in feeList"
                    :key="item.date"
                  >
                    <td >{{ item.date }}</td>
                    <td class="text-center">${{ item.pre3year }}</td>
                    <td class="text-center">${{ item.post3year }}</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
        </v-card>


        <v-card elevation="6" class="pa-4 mx-auto my-10 rounded-lg col-12 "
          min-height="230"
          rounded
          tiled
          exact 
          tile
          :ripple="false"
          >
            <v-card-text>
              <p class="text-h6 text--primary">
                Are these fees listed above correct for this facility?
              </p>
              <br>
              <v-radio-group
                row
              >
                <v-radio
                  label="Yes"
                  value="Yes"
                ></v-radio>
                <v-radio
                  label="No"
                  value="No"
                ></v-radio>
              </v-radio-group>
            </v-card-text>
          </v-card>

  </container>
</template>

<script>

export default {
  data() {
    return {
      input : '',
      feeList : [
        {
          date: 'Jan 2022',
          pre3year: 1234,
          post3year: 2222
        },
        {
          date: 'Feb 2022',
          pre3year: 5555,
          post3year: 8811
        },
        {
          date: 'Mar 2022',
          pre3year: 6754,
          post3year: 8223
        }
      ]
    };
  }
};


</script>
