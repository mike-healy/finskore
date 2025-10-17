import posthog from 'posthog-js';

export default {
  install(Vue) {
    posthog.init(process.env.POSTHOG_ID, {
      api_host: 'https://us.i.posthog.com',
      defaults: '2025-05-24'
    });

    Vue.prototype.$posthog = posthog;
  }
}

