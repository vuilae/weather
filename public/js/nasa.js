document.addEventListener("DOMContentLoaded", async function () {
  try {
    const response = await fetch("/nasa", {
      method: "POST",
    });

    if (response.ok) {
      const apodData = await response.json();

      // Update the HTML to display APOD content
      const apodContent = document.getElementById("apod-content");
      apodContent.innerHTML = `
          <h2>${apodData.title}</h2>
          <p>${apodData.date}</p>
          <img src="${apodData.url}" alt="${apodData.title}" style="max-width: 100%; height: auto;">
          <p>${apodData.explanation}</p>
      `;
    } else {
      const errorText = await response.text();
      console.error("Error fetching APOD data:", errorText);
      const apodContent = document.getElementById("apod-content");
      apodContent.innerHTML = "Error fetching APOD data";
    }
  } catch (error) {
    console.error("Error fetching APOD data:", error.message);
    const apodContent = document.getElementById("apod-content");
    apodContent.innerHTML = "Error fetching APOD data";
  }
});
