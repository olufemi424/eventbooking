import React from "react";
import { Bar } from "react-chartjs-2";

const BOOKINGS_BUCKETS = {
  Cheap: { min: 0, max: 100 },
  Normal: { min: 100, max: 200 },
  Expensive: { min: 200, max: 10000 }
};

const BookingsChart = props => {
  const output = {};
  const outputData = {
    labels: [],
    datasets: [
      {
        label: "Bookings Chart",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: []
      }
    ]
  };

  for (let bucket in BOOKINGS_BUCKETS) {
    const filteredBookingsCount = props.bookings.reduce((prev, curr) => {
      if (
        curr.event.price > BOOKINGS_BUCKETS[bucket].min &&
        curr.event.price < BOOKINGS_BUCKETS[bucket].max
      ) {
        return prev + 1;
      }
      return prev;
    }, 0);
    output[bucket] = filteredBookingsCount;
    outputData.labels.push(bucket);
  }

  for (let dataset in output) {
    outputData.datasets[0].data.push(output[dataset]);
  }

  console.log(outputData);
  return (
    <>
      <div>Bookings Chart</div>
      <Bar
        data={outputData}
        width={50}
        height={400}
        options={{ maintainAspectRatio: false }}
      />
    </>
  );
};

export default BookingsChart;
