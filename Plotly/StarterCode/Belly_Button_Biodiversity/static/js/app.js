function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
   
    d3.json('/metadata/' + sample).then((results) => {

    var MetadataSample = d3.select('#sample-metadata');
      
    // Use `.html("") to clear any existing metadata
    MetadataSample.html('');

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(results).forEach(([key, value])=> {
    MetadataSample.append('div')
    .style('word-wrap', 'break-word')
    .text('${key}: ${value}');
});
})
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
d3.json('/samples/' + sample).then((results) => {
    // @TODO: Build a Bubble Chart using the sample data
var dataBubbleChart = {
  x: results.otu_ids, y: results.sample_values,
  mode: 'markers', colorscale: 'Rainbow'
  marker: {color: results.otu_ids, size: results.sample_values},
  text: results.otu_labels };

  var Bubblechartdata = [dataBubbleChart];
  var Bubblechartlayout = {
    xaxis:{title: 'OTU ID'}, yaxis: {autorange: true}
  };
  Plotly.newPlot('bubble', Bubblechartdata, Bubblechartlayout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
var TotalvaluesSample = results.sample_values.length;
var ResultsSample = [];
for (var i =0; i <TotalvaluesSample; i++){
var Part  = {}
Part['otu_ids'] = results.otu_ids[i];
Part['sample_values'] = results.sample_values[i];
Part['otu_labels'] = results.otu_labels[i];

ResultsSample.push(Part);
}

ResultsSample.sort((one, two) => two.sample_values - one.sample_values);

var FirstTen = ResultsSample.slice(0,10);
console.log(FirstTen)

var Piechartdata = [{
  values: FirstTen.map(row => row.sample_values),
  labels: FirstTen.map(row => row.otu_ids),
  text: FirstTen.map(row.otu_labels), 
  hoovertext: results.otu_labels,
  type: 'pie'
}];

Plotly.newplot('pie', Piechartdata);
})
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
