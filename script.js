//creating references to the DOM elements
const countryInput = document.getElementById('country-input');
const loadingSpinner = document.getElementById('loading-spinner');
const countryInfoSection = document.getElementById('country-info');
const borderSection = document.getElementById('bordering-countries');
const errorMessage = document.getElementById('error-message');

// initalising page to defult state(hidding stuff), adds hidden to the names in the html
loadingSpinner.classList.add('hidden');
countryInfoSection.classList.add('hidden');
borderSection.classList.add('hidden');
errorMessage.classList.add('hidden');




async function searchCountry(countryName) 
{
    try 
    {


        // Show loading spinner
        const trimmedCountry = countryName.trim();
        if (!trimmedCountry) // they didnt enter a country
        {
            throw new Error('Please enter a country name.');
        }


        loadingSpinner.classList.remove('hidden'); // removes hidden from name
        errorMessage.classList.add('hidden');// hides error message
        errorMessage.textContent = '';// clears error message

        // searching a new country
        countryInfoSection.classList.add('hidden'); // hides current country info
        borderSection.classList.add('hidden');// hides border info
        countryInfoSection.innerHTML = '';// clears country info
        borderSection.innerHTML = ''; // clears border info

        // Fetch country data
        const response = await fetch(`https://restcountries.com/v3.1/name/${(trimmedCountry)}`);
        if (!response.ok)
        {
            throw new Error('Country not found. Please check the spelling and try again.');
        }
        const data = await response.json();
        const country = data[0];//taking first result



        // Update DOM
        const capital = country.capital && country.capital[0] ? country.capital[0] : 'N/A';

        // Update country info section
        countryInfoSection.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${capital}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag">
        `;
        // Example DOM updates
        // document.getElementById('country-info').innerHTML = `
        //     <h2>${country.name.common}</h2>
        //     <p><strong>Capital:</strong> ${country.capital[0]}</p>
        //     <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        //     <p><strong>Region:</strong> ${country.region}</p>
        //     <img src="${country.flags.svg}" alt="${country.name.common} flag">
        // `;

        // Required: Use async/await OR .then() for API calls
        // Required: Use try/catch OR .catch() for error handling
        


        countryInfoSection.classList.remove('hidden');

        // Fetch bordering countries
        const borderCodes = country.borders || [];
        let borderCountries = [];

        if (borderCodes.length > 0) {
            //fetches boardering countires by looking at the boardering codes and searching those
            const borderRequests = borderCodes.map(async (code) => {
                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                if (!borderResponse.ok) 
                {
                    throw new Error('Could not fetch bordering countries.');
                }
                const borderData = await borderResponse.json();
                return borderData[0];
            });
            borderCountries = await Promise.all(borderRequests); //waiting for all to finnish
        }

        // Update bordering countries section
        if (borderCountries.length === 0) 
        {
            borderSection.innerHTML = '<p>This country has no bordering countries.</p>';
        } 
        else 
        {
            borderSection.innerHTML = borderCountries // maps through the boardering countries and creates a card for each one
                .map((borderCountry) => `
                    <article class="border-country">
                        <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.common} flag">
                        <p>${borderCountry.name.common}</p>
                    </article>
                `)
                .join('');// joins the array of cards into a single string
        }
        borderSection.classList.remove('hidden');


    } 
    catch (error) 
    {

        // Show error message
        countryInfoSection.classList.add('hidden');
        borderSection.classList.add('hidden');
        errorMessage.textContent = error.message || 'Something went wrong while fetching country data.';
        errorMessage.classList.remove('hidden');


    } 
    finally 
    {
        // Hide loading spinner
        loadingSpinner.classList.add('hidden');
    }
}


// Event listeners
//given
// when search button clicked gets the value (country) from county-input
document.getElementById('search-btn').addEventListener('click', () => {
    const country = document.getElementById('country-input').value;
    searchCountry(country);
});

