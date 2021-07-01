import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Chart from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function getjustHoursOfDay() {
  var hours = [];

  for (var i = 0; i < 23; i++) {
    var _time;
    if (i < 10) {
      _time = "0" + i + ":00";
    } else {
      _time = i + ":00";
    }

    hours.push(_time);
  }

  var lastOfDay = "23:59";

  hours.push(lastOfDay);
  return hours;
}

export default function Diagram() {
  const chartContainer = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [date, setDate] = useState(new Date());
  const [diagramData, setDiagramData] = useState(
    []
    //[...Array(5)].map(() => Math.floor(Math.random() * 100))
  );
  const history = useHistory();

  const hourOfDay = getjustHoursOfDay();
  const chartConfig = {
    type: "line",
    data: {
      labels: hourOfDay,
      datasets: [
        {
          label: "Accesari la o anumita data",
          data: diagramData,
          borderColor: ["#4285F4"],
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          type: "time",
          time: {
            unit: "month",
          },
        },
      },
    },
  };

  const goBack = () => {
    history.goBack();
  };

  // const updateDataset = (datasetIndex, newData) => {
  //   chartInstance.data.datasets[datasetIndex].data = newData;
  //   chartInstance.update();
  // };

  // const onButtonClick = () => {
  //   const data = [1, 2, 3, 4, 5, 6];
  //   updateDataset(0, data);
  // };

  useEffect(() => {
    setDate(new Date());
  }, []);

  useEffect(() => {
    if (chartContainer && chartContainer.current) {
      const newChartInstance = new Chart(
        chartContainer.current.getContext("2d"),
        chartConfig
      );
      setChartInstance(newChartInstance);
    }
  }, [chartContainer]);

  useEffect(() => {
    const fetchLogData = async () => {
      const result = await axios(
        "http://localhost:9000/users/log-activity/" + date
      );
      setDiagramData(result.data);
      if (chartInstance) {
        chartInstance.data.datasets[0].data = result.data;
        chartInstance.update();
      }
    };
    fetchLogData();
  }, [date]);

  const diagramContainerStyle = {
    discplay: "flex",
    justifyContent: "center",
    marginTop: "5%",
    marginLeft: "15%",
    marginRight: "15%",
    marginBottom: "5%",
  };

  return (
    <div
      style={{
        paddingLeft: "4%",
        paddingRight: "4%",
        paddingTop: "2%",
      }}
    >
      <div className="form-group">
        <label>Selectati data: </label>
        <div>
          <DatePicker
            selected={date}
            onChange={(date) => {
              setDate(date);
            }}
          />
        </div>
      </div>

      <div style={diagramContainerStyle}>
        <canvas ref={chartContainer} />
      </div>

      <div className="d-flex flex-row">
        <div className="p-2">
          <button
            className="btn btn-primary btn-block"
            onClick={() => {
              goBack();
            }}
          >
            Inapoi
          </button>
        </div>
      </div>
    </div>
  );
}
