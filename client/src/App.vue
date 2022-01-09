<template>
  <div>
    <input type="text" v-model.trim="regionName" placeholder="Введите регион">
    <div ref="map" id="map"></div>
    <button id="reload-button" @click="updateMapData">Поиск</button>
  </div>
</template>

<style lang="scss">

  @import "~leaflet/dist/leaflet.css"; // стили для отображения карты

  input {
    position: absolute;
    right: 100px;
    top: 16px;
    z-index: 1000;
    width: 120px;
  }


  #reload-button {
    position: absolute;
    right: 16px;
    top: 16px;
    z-index: 1000;
    width: 80px;
  }

  #map {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
  }

</style>

<script>
  import L from 'leaflet';
  import axios from 'axios';

  export default {
    name: 'app',
    data() {
      return {
        regionName: '',
        map: null, // инстанс карты
        geometryGeoJSON: null, // инстанс geoJSON объекта
      }
    },

    mounted() {
      // создаем leaflet карту,
      // this.$refs.map -- это ссылка на на <div ref="map" id="map">
      this.map = L.map(this.$refs.map).setView([65.510, 100.331], 3);

      //Обновление карты (границ) при приближении или удалении
      this.map.on({
        "zoomend": this.updateMapData,
        "moveend": this.updateMapData
      });
      
      // подключаем карту тайлов на базе OpenStreetMap к инстансу карты
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy;<a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      // добавим область, но пока ее не будет видно на карте
      // так как к ней не привязаны данные
      this.geometryGeoJSON = L.geoJSON(null, {
        onEachFeature: (feature, layer) => {
            // событие по нажатию на область
            layer.bindPopup(feature.properties.name);
        }
      });
      this.geometryGeoJSON.addTo(this.map);
    },

    methods: {

      updateMapData() {
        axios(`/api/regionborder/`, {
          params: {
            regionName: this.regionName,
            zoom: this.map.getZoom(),
            bounds: this.map.getBounds().toBBoxString()
          }
        }).then(r => {
          // чистим геометрию от старых данных
          this.geometryGeoJSON.clearLayers();

          // подцепляем новую геометрию, которую вnpернул сервер
          this.geometryGeoJSON.addData(r.data.geometries);
        });
      },
    }
  }

</script>