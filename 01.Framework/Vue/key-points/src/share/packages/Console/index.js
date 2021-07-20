export default {
  install: function (Vue) {
    Vue.prototype.$console = function (...rest) {
      console.log(rest);
    };
  },
};
