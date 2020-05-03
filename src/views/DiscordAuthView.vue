<template>
    <div>
        ...
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
//import

@Component({
  components: {
  }
})
export default class DiscordAuthView extends Vue {

    constructor() {
        super();
    }

    created() {
        //console.log(this.$router.currentRoute)
        let payload = this.$router.currentRoute.hash;
        //console.log(payload)
        if (payload === '')
            this.$router.push('/')
        let parsedPayload = this.getUrlParams(payload)
        // @ts-ignore
        if (parsedPayload.access_token !== undefined && parsedPayload.access_token !== '')
        {
            // @ts-ignore
            let accessToken = parsedPayload.access_token;
            localStorage.setItem('accessToken_Discord', accessToken);
            this.$router.push('/games')
        } else {
            this.$router.push('/')
        }

    }

    getUrlParams(search: string) {
        const hashes = search.slice(search.indexOf('?') + 1).split('&')
        const params = {}

        hashes.map(hash => {
            const [key, val] = hash.split('=')
            params[key] = decodeURIComponent(val)
        })

        return params
    }
}
</script>

<style scoped lang="scss">

</style>