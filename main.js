// main.js
function render() {
  const sampleData = window.sampleData;

  const svg = d3.select("#plot");
  const width = +svg.attr("width");
  const height = +svg.attr("height");

  const margin = { top: 20, right: 30, bottom: 30, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  // Scales
  const x = d3.scaleTime()
    .domain(d3.extent(sampleData, d => d.parsedDate))
    .range([0, innerWidth]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(sampleData, d => d.Tonnage)]).nice()
    .range([innerHeight, 0]);

  const color = d3.scaleOrdinal()
    .domain(["bark", "brig", "schooner", "steamer", "ship", "sloop", "barkentine"])
    .range(d3.schemeTableau10);

  // Axes
  g.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x));

  g.append("g")
    .call(d3.axisLeft(y));

  // Tooltip
  d3.select("#tooltip")
    .style("position", "absolute")
    .style("padding", "8px")
    .style("background", "#fff")
    .style("border", "1px solid #ccc")
    .style("border-radius", "4px")
    .style("pointer-events", "none")
    .style("opacity", 0);

  function showTooltip(event, d) {
    const tooltip = d3.select("#tooltip");
    tooltip.html(`<strong>${d.Name}</strong><br>${d.Type}, ${d.Direction}, ${d.Tonnage} tons`)
      .style("left", `${event.pageX + 10}px`)
      .style("top", `${event.pageY}px`)
      .style("opacity", 1)
      .attr("aria-hidden", "false");
  }

  function hideTooltip() {
    d3.select("#tooltip").style("opacity", 0).attr("aria-hidden", "true");
  }

  // Draw dots
  g.selectAll("circle")
    .data(sampleData)
    .enter()
    .append("circle")
    .attr("cx", d => x(d.parsedDate))
    .attr("cy", d => y(d.Tonnage))
    .attr("r", 5)
    .attr("fill", d => color(d.Type))
    .on("mouseover", showTooltip)
    .on("mouseout", hideTooltip)
    .on("click", d => playVesselSound(d));

  // Tone.js playback
  function playVesselSound(d) {
    const synth = new Tone.Synth().toDestination();
    const pan = d.Direction === "Inbound" ? -1 : 1;
    const panner = new Tone.Panner(pan).toDestination();
    synth.connect(panner);

    const freq = d3.scaleLinear()
      .domain([2, 1500])
      .range([880, 110])
      .clamp(true)(d.Tonnage);

    synth.triggerAttackRelease(freq, "8n");
  }

  // Playback controls
  let isPlaying = false;
  let playbackSpeed = 1;
  let currentIndex = 0;

  const playBtn = document.getElementById("play-btn");
  const pauseBtn = document.getElementById("pause-btn");
  const speedSelect = document.getElementById("speed");

  playBtn.addEventListener("click", () => {
    if (!isPlaying) {
      isPlaying = true;
      Tone.start();
      playLoop();
    }
  });

  pauseBtn.addEventListener("click", () => {
    isPlaying = false;
  });

  speedSelect.addEventListener("change", e => {
    playbackSpeed = +e.target.value;
  });

  async function playLoop() {
    const sortedData = sampleData.sort((a, b) => a.parsedDate - b.parsedDate);

    while (isPlaying && currentIndex < sortedData.length) {
      const currentDate = sortedData[currentIndex].parsedDate;
      const todayVessels = sortedData.filter(d => +d.parsedDate === +currentDate);

      for (const vessel of todayVessels) {
        playVesselSound(vessel);
        await Tone.start();
        await new Promise(r => setTimeout(r, 300 / playbackSpeed));
      }

      currentIndex += todayVessels.length;
      await new Promise(r => setTimeout(r, 400 / playbackSpeed));
    }
  }
}

d3.csv("data/vessels.csv").then(data => {
  data.forEach(d => {
    d.parsedDate = d3.timeParse("%Y-%m-%d")(d.Date);
    d.Tonnage = +d.Tonnage;
  });
  window.sampleData = data;
  render();
});
