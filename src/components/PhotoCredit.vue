<template>
    <span v-if="christmas && typeof credits[theme] !== 'undefined'" class="bg-credit">
    Background by <a :href="photographerLink" target="_blank" noopener="true">{{ photographer }}</a>
    </span>
</template>

<script>
export default {
    props: ['christmas', 'theme'],

    data() {
        return {
            credits: {
                default: {
                    link: 'https://unsplash.com/@kierancwhite',
                    name: 'Kieran White'
                },

                hot: {
                    link: 'https://unsplash.com/@anniespratt',
                    name: 'Annie Spratt'
                }
            }
        };
    },

    computed: {
        photographerLink() {
            return this.credits[this.theme].link;
        },

        photographer() {
            return this.credits[this.theme].name;
        }
    }
}
</script>
