import React, { Component, useState } from "react";
import ChartistGraph from "react-chartist";
import { Grid, Row, Col } from "react-bootstrap";

import { Card } from "components/Card/Card.jsx";
import { StatsCard } from "components/StatsCard/StatsCard.jsx";
import {
  dataSales,
  optionsSales,
  responsiveSales,
  dataBar,
  optionsBar,
  responsiveBar
} from "variables/Variables.jsx";

class Dashboard extends Component {
  state = {
    temperature: 0,
    humidity: 0,
    last_measure: 0,
    graphMeasures: {
      labels: [
        "00:00",
        "01:00",
        "02:00",
        "03:00",
        "04:00",
        "05:00",
        "06:00",
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00",
        "24:00",
      ],
      series: [
        [],
        []
      ]
    }
  };

  componentDidMount() {
    this.timer = setInterval(() => this.getData(), 5000)
  }

  async getData() {
    fetch("http://192.168.0.99/sist-distribuidos/api/data/last")
      .then(response => {
        return response.json()
      })
      .then(data => {
        this.setState({
          temperature: data.data.temperature,
          humidity: data.data.humidity,
          last_measure: data.data.read_at.formatted
        })
      }
      ).catch(function (error) {
        console.log(error);
      });

    fetch("http://192.168.0.99/sist-distribuidos/api/data/hour_average")
      .then(response => {
        return response.json()
      })
      .then(data => {
        var temperatures = new Array();
        for(var i=0; i<data.data.length; i++) {
          temperatures.push(data.data[i].avg_temperature);
        }
        temperatures.splice(0, 1);

        var humidities = new Array();
        for(var i=0; i<data.data.length; i++) {
          humidities.push(data.data[i].avg_humidity);
        }
        humidities.splice(0, 1);

        var tmp = {
          labels: this.state.graphMeasures.labels,
          series: [
            temperatures,
            humidities
          ]
        };

        console.log(tmp);

        this.setState({
          graphMeasures: tmp
        })

        var teste = {temperatures}
      }
      ).catch(function (error) {
        console.log(error);
      });  
  }
  render() {
    return (
      <div className="content">
        <Grid fluid>
          <Row>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-eyedropper text-warning" />}
                statsText="Temperatura"
                statsValue={this.state.temperature + "º"}
                statsIcon={<i className="pe-7s-eyedropper" />}
                statsIconText={"Ultimo Registro: " + this.state.last_measure}
              />
            </Col>
            <Col lg={3} sm={6}>
              <StatsCard
                bigIcon={<i className="pe-7s-drop text-info" />}
                statsText="Umidade"
                statsValue={this.state.humidity + "%"}
                statsIcon={<i className="pe-7s-drop" />}
                statsIconText={"Ultimo Registro: " + this.state.last_measure}
              />
            </Col>
          </Row>
          {/* start gráficos */}
          <Row>
            <Col md={13}>
              <Card
                statsIcon="fa fa-history"
                id="chartHours"
                title="Temperatura e Umidade média por hora"
                category="24 Hours performance"
                stats={"Atualizado as"}
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data={this.state.graphMeasures}
                      type="Line"
                      options={optionsSales}
                      responsiveOptions={responsiveSales}
                    />
                  </div>
                }
              />
            </Col>
            {/* <Col md={4}>
              <Card
                statsIcon="fa fa-clock-o"
                title="Email Statistics"
                category="Last Campaign Performance"
                stats="Campaign sent 2 days ago"
                content={
                  <div
                    id="chartPreferences"
                    className="ct-chart ct-perfect-fourth"
                  >
                    <ChartistGraph data={dataPie} type="Pie" />
                  </div>
                }
              />
            </Col> */}
          </Row>
          {/* end gráficos */}
          <Row>
            <Col md={13}>
              <Card
                id="chartActivity"
                title="2014 Sales"
                category="All products including Taxes"
                stats="Data information certified"
                statsIcon="fa fa-check"
                content={
                  <div className="ct-chart">
                    <ChartistGraph
                      data={dataBar}
                      type="Bar"
                      options={optionsBar}
                      responsiveOptions={responsiveBar}
                    />
                  </div>
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Dashboard;
