import {minLength, minValue, numeric, required} from "vuelidate/lib/validators";

export default {
  entity: {
    path: {
      required,
      minLength: minLength(2)
    },
    app: {
      required
    },
    rowLimit: {
      numeric,
      minValue: minValue(0)
    },
    dimensions: {
      $each: {
        name: {
          required,
          minLength: minLength(2),
          isUniq: function (val) {
            let n = this.entity.dimensions.reduce((acc, elem) => {
              return (elem.name == val) ? acc + 1 : acc;
            }, 0);
            return n <= 1;
          }
        },
        expression: {},
        type: {},
        id: {},
      }
    },
    measures: {
      $each: {
        name: {
          required,
          minLength: minLength(2),
          isUniq: function (val) {
            let n = this.entity.measures.reduce((acc, elem) => {
              return (elem.name == val) ? acc + 1 : acc;
            }, 0);
            return n <= 1;
          }
        },
        expression: {},
        type: {},
        id: {},
      }
    }
  }
}