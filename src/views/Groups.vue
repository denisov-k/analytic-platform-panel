<template>
    <div class="views--api-methods">
        <section class="uk-section uk-padding">
            <vk-card style="width: 600px;">
                <div slot="header">
                    <h2 class="uk-margin-remove">{{ $route.meta.viewTitle }}<vk-spinner class="uk-margin-left" v-if="loading"></vk-spinner></h2>
                    <p class="uk-text-muted uk-margin-remove">{{ $route.meta.viewDescription }}</p>
                </div>
                <tree></tree>
            </vk-card>
        </section>
    </div>
</template>

<script>
    import Tree from '../components/views/Groups/GroupsTree';

    export default {
        components: {
          Tree
        },
        data() {
            return {
                loading: false
            }
        },
        name: "Groups"
    }
</script>

<style scoped>

</style>