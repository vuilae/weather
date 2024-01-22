document
  .getElementById("movieForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const movieTitle = document.getElementById("movieTitle").value;

    try {
      const response = await fetch("/movie", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ movieTitle }),
      });

      if (response.ok) {
        const responseData = await response.json();
        const movieResultContainer = document.getElementById(
          "movieResultContainer"
        );
        movieResultContainer.innerHTML = responseData.movieHtml;
      } else {
        console.error("Error fetching movie data:", response.statusText);
        document.getElementById("movieResult").innerHTML =
          "Error fetching movie data";
      }
    } catch (error) {
      console.error("Error fetching movie data:", error.message);
      document.getElementById("movieResult").innerHTML =
        "Error fetching movie data";
    }
  });
