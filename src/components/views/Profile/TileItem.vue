<template>
    <div class="tile-item" :style="css" :data-width="tile.width" :data-height="tile.height" :data-type="tile.type">
        <div class="tile-item--label" :class="{ 'uk-text-white': tile.style && tile.style.backgroundColor[0].toLowerCase() !== '#ffffff' && tile.style.backgroundColor[0].toLowerCase() !== '#fff' }" >{{ tileName }}</div>
        <div class="tile-item--value" v-if="tile.type != 'diagram'">значение</div>        
        <div class="tile-item--diagram" v-if="tile.type == 'diagram'">
            <div class="icon"><i class="mdi mdi mdi-finance mdi-36px"></i></div>
        </div>
        <div class="tile-item--icon-hint icon" v-if="tileHint.length" v-tooltip="tileHint"><i class="mdi mdi-help-circle-outline"></i></div>                                     
        <!--
            children пока убрали
        <div class="tile-item--icon-graph icon" v-if="tile.children.length"><i class="mdi mdi-poll-box"></i></div>
        -->
        <div class="tile-item--controls">
            <slot name="controls"></slot>
        </div>
    </div>
</template>
<script>
export default {
    name: 'tile-item',
    data: function() {
        return { };
    },
    props: {        
        tile: {
            type: Object,
            default: function() { return {} },
        },
        tileHint: {
            type: String,
            default: ''
        },
        tileName: {
            type: String,
            default: '',
        },
        css: {
            type: Object,
            default: function() { return {} },
        }
    }
}
</script>