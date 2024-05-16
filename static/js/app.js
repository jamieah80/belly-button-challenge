// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;
    // Filter the metadata for the object with the desired sample number
    function desiredsample(datasample) {
      return datasample.id == sample;
    }

    let sampleobject = metadata.filter(desiredsample);
    let samples = sampleobject[0]
    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
  
    for (key in samples) {
      panel.append("p").text(`${key.toUpperCase()}: ${samples[key]}`);
    };
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samplefield = data.samples;

    // Filter the samples for the object with the desired sample number
    function desiredsamples(datasample) {
      return datasample.id == sample;
    }

    let sample_object = samplefield.filter(desiredsamples);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = sample_object[0].otu_ids;
    let otu_labels = sample_object[0].otu_labels;
    let sample_values = sample_object[0].sample_values;
    
    // Build a Bubble Chart
    let bubbledata = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_ids,
          opacity: 0.6
        },
      }
    ];
    
    let layout = {
      title: 'Bacteria Cultures Per Sample',
    };
    // Render the Bubble Chart
    Plotly.newPlot('bubble', bubbledata, layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otu_ids.map(id => `OTU ${id}`);

    // Don't forget to slice and reverse the input data appropriately
    let sorteddata = otu_ids.sort((a, b) => a - b);
    let top10 = sorteddata.slice(0, 10);

    // Build a Bar Chart
    let trace1 = {
      x: top10,
      y: yticks,
      type: "bar",
      orientation: 'h'
    };
    let bardata = [trace1];
    
    let barlayout = {
      title: 'Top 10 Bacteria Cultures Found'
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', bardata, barlayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdownMenu = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    options = dropdownMenu.selectAll("option")
    .data(names)
    .enter()
    .append("option")
    .text(function(d) { return d; });


    // Get the first sample from the list
    let firstsample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstsample);
    buildMetadata(firstsample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
