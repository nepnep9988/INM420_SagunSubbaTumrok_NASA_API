
const API_KEY = "IjiOgwvb3qO6BIsqnT9KeWhgfebPKNkUPhzLj7Pd   ";

// Select HTML elements
const dateInput = document.querySelector("#date-input");
const searchBtn = document.querySelector("#search-btn");
const apodTitle = document.querySelector("#apod-title");
const apodMedia = document.querySelector("#apod-media");
const apodDate = document.querySelector("#apod-date");
const apodDescription = document.querySelector("#apod-description");
const statusText = document.querySelector("#status");

// Set today's date as the default
const today = new Date();

const localToday = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
).toISOString().split("T")[0];

dateInput.value = localToday;
dateInput.max = localToday;
dateInput.min = "1995-06-16";

// Fetch NASA's Astronomy Picture of the Day
async function getAPOD(date) {
    // Show loading message
    statusText.textContent = "Loading NASA's astronomy picture...";
    searchBtn.disabled = true;

    // Clear previous results
    apodTitle.textContent = "";
    apodDate.textContent = "";
    apodDescription.textContent = "";
    apodMedia.replaceChildren();

    // NASA API request and coverting the date 
const formattedDate = date.replaceAll("-", "").slice(2);

// Request one specific NASA picture
const url = `https://science.nasa.gov/wp-json/wp/v2/apod-basic/${formattedDate}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch NASA data.");
        }

        const data = await response.json();

        console.log("NASA API Response:", data);

        // Handle both object and array responses
        const picture = Array.isArray(data)
            ? data.find(item => item.date === date)
            : data;

        // Check that the selected date was returned
        if (!picture || picture.date !== date) {
            throw new Error("No picture found for the selected date.");
        }

        // Display NASA information
        apodTitle.textContent = picture.title;
        apodDate.textContent = picture.date;
        // Convert NASA's HTML explanation into readable text
        const explanationDocument = new DOMParser().parseFromString(
            picture.explanation || "",
            "text/html"
);

apodDescription.textContent = explanationDocument.body.textContent.trim();

        // Display image if available
        if (picture.media_type === "image" && picture.hdurl) {
            const image = document.createElement("img");

            image.src = picture.hdurl;
            image.alt = picture.alt || picture.title;

            image.onerror = function () {
                statusText.textContent = "The image could not be loaded.";
            };

            apodMedia.appendChild(image);

        } else {
            // Display a link for videos or other media
            const link = document.createElement("a");

            link.href = picture.permalink || picture.url;
            link.textContent = "View this entry on NASA";
            link.target = "_blank";
            link.rel = "noopener noreferrer";

            apodMedia.appendChild(link);
        }

        // Clear loading message
        statusText.textContent = "";

    } catch (error) {
    statusText.textContent =
        "Unable to load NASA data: " + error.message;

    console.error("NASA API Error:", error);


    } finally {
        // Enable the button again
        searchBtn.disabled = false;
    }
}

// Run when the user clicks Explore Space
searchBtn.addEventListener("click", function () {
    getAPOD(dateInput.value);
});
