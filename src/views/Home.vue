<template>
    <div class="views--healthcheck">
        <section class="uk-section uk-padding">
            <vk-card id="welcome">
                <div class="uk-overflow-auto">
                    <span>Welcome home</span>
                </div>
            </vk-card>
            <div id="statuses">
                <vk-card class="status-card">
                    <h4>Заметки</h4>
                    <textarea class="note" placeholder="Keep your things here..." v-model="noteContent"></textarea>
                </vk-card>
                <vk-card class="status-card" v-for="table in data" :key="table.title">
                    <div class="uk-overflow-auto">
                        <vk-table :data="table.data">
                            <vk-table-column :title="table.title" cell="description" class="component-title"></vk-table-column>
                            <vk-table-column cell="status">
                                <div v-bind:class="{ 'status-good-value': cell.type === statuses.SUCCESS, 'status-bad-value': cell === false }"
                                     class="status-value" slot-scope="{ cell }">{{ cell.value }}</div>
                            </vk-table-column>

                        </vk-table>
                    </div>
                </vk-card>

            </div>
        </section>
    </div>
</template>

<script>
    import HealthCheckService from '../services/HealthCheckService';
    import statuses from '../utils/HealthCheckStatuses';

    export default {
        name: "Home",
        data() {
            return {
                data: [],
                statuses,
                noteContent: localStorage.userNote || ''
            }
        },
        created() {
            window.onbeforeunload = this.saveNoteContent;

            this.healthCheckService = new HealthCheckService();

            this.healthCheckService.getStatus().then(status => {
                this.data = status;
            })
        },
        beforeDestroy() {
            this.saveNoteContent()
        },
        methods: {
            saveNoteContent: function (event) {
                localStorage.userNote = this.noteContent;
            }
        }
    }
</script>

<style>
    #welcome {
        margin-bottom: 20px;
        text-align: center;
        min-width: 370px;
        border-radius: 35px 35px 5px 5px;
    }
    #welcome div {
        overflow: hidden;
        padding: 10px 30px;
    }

    #welcome span {
        text-transform: uppercase;
        line-height: 1;
        font-size: 5.5vw;
        text-align: center;
        overflow: hidden;
        text-decoration: none;
        -webkit-transition: all 0.5s;
        transition: all 0.5s;
        font-family: 'Berkshire Swash', cursive;
        background-color: #d6d6d6;
        color: transparent;
        text-shadow: 2px 2px 3px rgba(255,255,255,0.5);
        -webkit-background-clip: text;
        user-select: none;

        font-family: 'Julius Sans One', sans-serif;
        color: #2d5f75;
    }

    #statuses {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    .status-card {
        display: inline-table;
        float: left;
        width: calc(50% - 10px);
        margin-bottom: 20px;
        /*max-width: 800px;*/
        min-width: 370px;
        transition: all 0.5s;
    }
    .status-card h4 {
        color: #66778F;
        font-size: 0.875rem;
        text-transform: uppercase;
        font-weight: 700;
        margin: 0px 0px 5px 0px;
    }

    .status-value {
        border: 1px solid #eaeaea;
        border-radius: 6px;
        padding: 2px 13px;
        display: inline-block;
        min-width: 140px;
        float: right;
    }
    .status-good-value {
        background: #f7f7f7;
        color: #004a18;
        text-align: center;
        border-color: #d6d6d6;
    }
    .status-bad-value {
        background: #f1cad1;
        color: #923d57;
        text-align: center;
    }
    .component-title {
        font-weight: 700 !important;
    }
    .views--healthcheck td {
        width: 50%;
        vertical-align: middle !important;
    }

    .note {
        width: 100%;
        min-height: 100px;
        height: 100px;
        border: 1px solid #dfe2e8;
        font-size: 14px;
        resize: vertical;
    }
    .note::placeholder {
        color: #bfbfbf;
    }

    @media only screen and (max-width: 1120px) {
        .status-card {
            width: 100%;
        }

    }
</style>