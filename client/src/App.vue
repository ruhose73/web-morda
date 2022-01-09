<template>
  <div>
    <div ref="map" id="map"></div>
    <button id="reload-button" @click="updateMapData">Reload</button>
  </div>
</template>


<style lang="scss">
  // стиля для leaflet
  @import "~leaflet/dist/leaflet.css";

  #reload-button {
    position: absolute;
    right: 16px;
    top: 16px;
    z-index: 1000;
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
        map: null, // инстанс leaflet карты
        geometryGeoJSON: null, // инстанс geoJSON объекта
      }
    },
    mounted() {
      // когда данный Vue компонент подключилось к dom дереву
      // создаем leaflet карту,
      // this.$refs.map -- это ссылка на на <div ref="map" id="map">
      this.map = L.map(this.$refs.map).setView([58.505, 108.0], 5);

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
      this.geometryGeoJSON = L.geoJSON();
      this.geometryGeoJSON.addTo(this.map);
    },
    methods: {
  updateMapData() {
    axios(`/api/border/`, {
      params: {
        zoom: this.map.getZoom(),
        bounds: this.map.getBounds().toBBoxString() // вот новый параметр
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