import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

const vuetify = createVuetify({
  theme: {
    defaultTheme: "dark"
  },
  components,
  directives,
  icons: {
    defaultSet: "mdi"
  }
});
export default vuetify;
