const { axiosInstance } = require('./axios');
const { Client } = require("@googlemaps/google-maps-services-js");

module.exports.mapsClient = new Client({
    axiosInstance: axiosInstance
});