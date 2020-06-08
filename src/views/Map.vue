<template>
    <v-flex
        xs12
        md12
        >
        <div class="map">
            <l-map
            :center="[0.559, 38.2]"
            :zoom="6"
            :options="mapOptions"
            style="height: 500px;">
                <l-choropleth-layer
                :data="datas"
                :value="values"
                :extraValues="extraValues"
                :geojson="paraguayGeojson"
                :color-scale="colorScale"
                :stroke-color="currentStrokeColor"
                title-key="department_name"
                id-key="department_id"
                geojson-id-key="dpto">
                <template slot-scope="props">
                    <l-info-control
                    :item="props.currentItem"
                    :unit="props.unit"
                    class="bcols"
                    title="County"
                    placeholder="Hover over a County"/>
                    <l-reference-chart
                    :color-scale="colorScale"
                    :min="props.min"
                    :max="props.max"
                    title="Users Enrolment"
                    position="topright"/>
                </template>
                </l-choropleth-layer>
            </l-map>
        </div>
    </v-flex>
</template>
<script>
import { InfoControl, ReferenceChart, ChoroplethLayer } from 'vue-choropleth'
import * as geojson from '../vendor/data'
import paraguayGeojson from '../vendor/counties.json'
import { pyDepartmentsData } from '../vendor/para_dep'
import { LMap } from 'vue2-leaflet'


export default {
    props: {
        exposures: Array, // eslint-disable-line
        users: Array // eslint-disable-line
    },
    data () {
        return {
            pyDepartmentsData,
            paraguayGeojson,
            colorScale: geojson.colorArray,
            values: {
                key: 'exposures',
                metric: 'Exposures'
            },
            extraValues: [{
                key: 'users',
                metric: 'Users'
            }],
            mapOptions: {
                attributionControl: false
            },
            currentStrokeColor: '1D1D1D',
            datas: []
        }
    },
    components: {
        LMap,
        'l-info-control': InfoControl,
        'l-reference-chart': ReferenceChart,
        'l-choropleth-layer': ChoroplethLayer
    },
    created() {
        this.getExpData(this.exposures)
    },
    methods: {
        getUsData (n) {
            var a = []
            var b = []
            var prev
            var count = 0
            var arr = []
            this.datas = []
            for (var f in n) {
                arr.push(n[f].county)
            }
            arr.sort()
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] !== prev) {
                a.push(arr[i])
                b.push(1)
                } else {
                b[b.length - 1]++
                }
                prev = arr[i]
            }
            console.log(a, b)
            for (var e in pyDepartmentsData) {
                pyDepartmentsData[e].users = 0
            }
            for (var i in a) {
                for (var e in pyDepartmentsData) {
                if (a[i] === pyDepartmentsData[e].department_name) {
                    pyDepartmentsData[e].users = b[i]
                }
                this.datas = pyDepartmentsData
                }
            }
        },
        getExpData (n) {
            var a = []
            var b = []
            var prev
            var count = 0
            var arr = []
            this.datas = []
            for (var f in n) {
                arr.push(n[f].county)
            }
            arr.sort()
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] !== prev) {
                a.push(arr[i])
                b.push(1)
                } else {
                b[b.length - 1]++
                }
                prev = arr[i]
            }
            for (var e in pyDepartmentsData) {
                pyDepartmentsData[e].exposures = 0
            }
            for (var i in a) {
                for (var e in pyDepartmentsData) {
                if (a[i] === pyDepartmentsData[e].department_name) {
                    pyDepartmentsData[e].exposures = b[i]
                }
                this.datas = pyDepartmentsData
                }
            }
            this.getUsData(this.users)
        }
    }
}
</script>
<style scoped>
@import "../../node_modules/leaflet/dist/leaflet.css";
body {
    background-color: #e7d090;
    margin-left: 100px;
    margin-right: 100px;
}
#map {
    background-color: #eee;
}
</style>