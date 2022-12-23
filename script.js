Vue.component("app-grid", {
  template: `<table class="table">
    <thead>
        <tr class="is-primary">
            <th v-for="(key, index) in columns" @click="sortBy(key)" :class="{ active: sortKey == key }">
                <span>{{labels[index]}}</span>
                <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'">
          </span>
            </th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="entry in filteredData">
            <td v-for="key in columns">
                {{ formatValue(entry[key], key) }}
            </td>
        </tr>
    </tbody>
</table>`,
  props: {
    data: Array,
    columns: Array,
    labels: Array,
    filterKey: String
  },
  data: function() {
    var sortOrders = {};
    this.columns.forEach(function(key) {
      sortOrders[key] = 1;
    });
    return {
      sortKey: "",
      sortOrders: sortOrders
    };
  },
  computed: {
    filteredData: function() {
      var sortKey = this.sortKey;
      var filterKey = this.filterKey && this.filterKey.toLowerCase();
      var order = this.sortOrders[sortKey] || 1;
      var data = this.data;
      if (filterKey) {
        data = data.filter(function(row) {
          return Object.keys(row).some(function(key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1;
          });
        });
      }
      if (sortKey) {
        data = data.slice().sort(function(a, b) {
          a = a[sortKey];
          b = b[sortKey];
          return (a === b ? 0 : a > b ? 1 : -1) * order;
        });
      }
      return data;
    }
  },
  methods: {
    sortBy: function(key) {
      this.sortKey = key;
      this.sortOrders[key] = this.sortOrders[key] * -1;
    },
    formatValue(value, key) {
      if (key == "grossUnadjusted" || key == "grossAdjusted") {
        console.log(key);
        if (value != null) {
          return "$" + value.toLocaleString("en-US", {
            style: "decimal"
          });
        }
      } else {
        return value;
      }
    }
  }
});

var app = new Vue({
  el: "#app",
  data: {
    searchQuery: "",
    gridColumns: ["NAME", "PRIMARY", "SECONDARY", "PAGER", "FAX", "TUBE"],
    gridLabels: ["NAME", "PRIMARY", "SECONDARY", "PAGER", "FAX", "TUBE"],
    gridData: [],
    options: [

    ]
  },
  methods: {
    fetchFilmData: function() {
      var xhr = new XMLHttpRequest();
      var self = this;
      xhr.open(
        "GET",
        "https://raw.githubusercontent.com/dirtydanisreal/numberDataJson/main/numberData.json"
      );
      xhr.onload = function() {
        self.gridData = JSON.parse(xhr.responseText);
      };
      xhr.send();
    }
  }
});
app.fetchFilmData();
