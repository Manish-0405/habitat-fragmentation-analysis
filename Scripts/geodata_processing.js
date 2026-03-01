// Load Rajkot boundary
var rajkotBoundary = ee.FeatureCollection("projects/ee-manishkumarchoudhary122450/assets/rajkot_boundary");

// Function to mask clouds using MSK_CLDPRB and MSK_SNWPRB bands (clouds and snow)
var maskClouds = function(image) {
  var cloudMask = image.select('MSK_CLDPRB').lt(50)   // Mask cloudy pixels with cloud probability < 50%
      .and(image.select('MSK_SNWPRB').lt(50));         // Mask snow pixels with snow probability < 50%
  
  // Apply the cloud mask and scale reflectance values
  return image.updateMask(cloudMask).divide(10000);
};

// Load Sentinel-2 imagery (L2A) and apply cloud masking
var sentinel = ee.ImageCollection('COPERNICUS/S2_SR')
  .filterBounds(rajkotBoundary)
  .filterDate('2020-01-01', '2023-01-01')
  .map(maskClouds);  // Apply cloud masking

// Function to calculate NDVI
var calculateNDVI = function(image) {
  var ndvi = image.normalizedDifference(['B8', 'B4']).rename('NDVI'); // NIR (B8) and Red (B4)
  return image.addBands(ndvi).select(['NDVI', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B8A', 'B9', 'B11', 'B12']); // Select only the necessary bands
};

// Apply NDVI calculation to the image collection
var ndviCollection = sentinel.map(calculateNDVI);

// Visualize NDVI
var ndviMean = ndviCollection.mean().select('NDVI').clip(rajkotBoundary);
var ndviVis = {min: 0, max: 1, palette: ['white', 'green']};
Map.centerObject(rajkotBoundary, 10);
Map.addLayer(ndviMean, ndviVis, "NDVI");

// Export NDVI data
Export.image.toDrive({
  image: ndviMean,
  description: 'Rajkot_NDVI',
  scale: 10, // Sentinel-2 resolution
  region: rajkotBoundary.geometry(),
  fileFormat: 'GeoTIFF'
});
