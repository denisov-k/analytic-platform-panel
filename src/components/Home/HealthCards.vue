<template>
  <div class="health-cards">
    <vk-card class="status-card" v-for="card in data" :key="card.title">
      <div class="uk-overflow-auto">
        <vk-table :data="card.data">
          <vk-table-column :title="card.title" cell="description" class="component-title"></vk-table-column>
          <vk-table-column cell="status">
            <div
                v-bind:class="{ 'status-good-value': cell.type === HealthStatuses.SUCCESS, 'status-bad-value': cell === false }"
                class="status-value" slot-scope="{ cell }">{{ cell.value }}
            </div>
          </vk-table-column>
        </vk-table>
      </div>
    </vk-card>
  </div>
</template>

<script>
    import HealthCheckService from "@/services/HealthCheckService";
    import HealthStatuses from '@/utils/HealthCheckStatuses';

    export default {
      name: "HealthCards",
      data() {
        return {
          data: [],
          HealthStatuses
        }
      },
      created() {
        this.healthCheckService = new HealthCheckService();

        this.healthCheckService.getStatus().then(status => {
          this.data = status;
        })
      },
    }
</script>

<style scoped>
  .health-cards {
    display: contents;
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

</style>