<template>
  <div class="views--healthcheck">
    <section class="uk-section uk-padding">
      <vk-card id="welcome">
        <div class="uk-overflow-auto">
          <span>Welcome home</span>
        </div>
      </vk-card>
      <div id="statuses">
        <notes></notes>
        <health-cards></health-cards>
      </div>
    </section>
  </div>
</template>

<script>
import Notes from "@/components/Home/Notes";
import HealthCards from "@/components/Home/HealthCards";

export default {
  name: "Home",
  components: {
    HealthCards,
    Notes
  },
  data() {
    return {

    }
  },
  created() {

  },
  methods: {

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
      text-shadow: 2px 2px 3px rgba(255, 255, 255, 0.5);
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
    @media only screen and (max-width: 1120px) {
      .status-card {
        width: 100%;
      }
    }
    .status-card td {
      width: 50%;
      vertical-align: middle !important;
    }

    .status-card h4 {
      color: #66778F;
      font-size: 0.875rem;
      text-transform: uppercase;
      font-weight: 700;
      margin: 0px 0px 5px 0px;
    }
    .status-card .component-title {
      font-weight: 700 !important;
    }

</style>