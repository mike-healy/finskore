import posthog from 'posthog-js';

export default {
  install(Vue) {
    posthog.init('phc_dMXGXDIA9xrfH8SVSWLPHZU6ksoSvTywEP7QOS9Apqt', {
      api_host: 'https://us.i.posthog.com',
      defaults: '2025-05-24'
    });

    Vue.prototype.$posthog = posthog;
  }
}
