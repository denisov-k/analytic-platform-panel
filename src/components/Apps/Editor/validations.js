import {minLength, minValue, numeric, required} from "vuelidate/lib/validators";

export default {
  entity: {
    name: {
      required,
      minLength: minLength(2)
    },
    source: {
      required
    },
    filters: {
      $each: {
        name: {
          required,
          minLength: minLength(2),
          isUniq: function (val) {
            let n = this.entity.filters.reduce((acc, elem) => {
              return (elem.name == val) ? acc + 1 : acc;
            }, 0);
            return n <= 1;
          }
        },
        qName: {},
      }
    },
    variables: {
      $each: {
        name: {
          required,
          minLength: minLength(2),
          isUniq: function (val) {
            let n = this.entity.filters.reduce((acc, elem) => {
              return (elem.name == val) ? acc + 1 : acc;
            }, 0);
            return n <= 1;
          }
        },
        qName: {},
      }
    }
  }
}