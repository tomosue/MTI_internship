<script>
import { Bar } from "vue-chartjs";
export default {
  extends: Bar,
  data() {
    function getDateArray() {
      const currentDate = new Date();
      var dateArray = [];

      currentDate.setDate(currentDate.getDate() - 14);

      for (let step = 0; step < 14; step++) {
        currentDate.setDate(currentDate.getDate() + 1);
        var month = currentDate.getMonth() + 1;
        var date = currentDate.getDate();

        var day = month + "/" + date;
        dateArray.push(day);
      }

      return dateArray;
    }

    const labelsArray = getDateArray();
    // const labelsArray = [
    //   "8/21",
    //   "8/22",
    //   "8/23",
    //   "8/24",
    //   "8/25",
    //   "8/26",
    //   "8/27",
    //   "8/28",
    //   "8/29",
    //   "8/30",
    //   "8/31",
    //   "9/1",
    //   "9/2",
    //   "9/3",
    // ];
    const dataArrayP = [40, 30, 50, 25, 70, 40, 30, 50, 25, 70, 80, 20, 30, 50];
    const dataArrayC = [20, 40, 30, 45, 20, 40, 35, 20, 35, 70, 85, 25, 40, 70];
    const dataArrayF = [30, 50, 30, 55, 60, 20, 45, 10, 65, 20, 35, 75, 10, 30];
    return {
      chartdata: {
        labels: labelsArray,
        datasets: [
          {
            label: ["タンパク質"],
            backgroundColor: "#f87979",
            data: dataArrayP,
            fill: false,
            type: "line",
            lineTension: 0,
          },
          {
            label: ["炭水化物"],
            backgroundColor: "#87ceeb",
            data: dataArrayC,
            fill: false,
            type: "line",
            lineTension: 0,
          },
          {
            label: ["脂肪"],
            backgroundColor: "#ffa500",
            data: dataArrayF,
            fill: false,
            type: "line",
            lineTension: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "日",
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                stepSize: 10,
              },
              scaleLabel: {
                display: true,
                labelString: "グラム(g)",
              },
            },
          ],
        },
      },
    };
  },
  mounted() {
    this.renderChart(this.chartdata, this.options);
  },
};
</script>
