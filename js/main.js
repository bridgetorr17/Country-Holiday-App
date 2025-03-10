let countryList;
let previousCountryCode = '';

fetch("https://date.nager.at/api/v3/AvailableCountries")
    .then(res => res.json())
    .then(data => {
        countryList = data;
    })
    .catch(err => {
        console.log(`error ${err}`)
    });

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('path').forEach(country => {
        country.addEventListener('click', function () {
            getHolidayData(country.getAttribute('title'));
        });            
    });
});


function getHolidayData(countryName){
    //get the countryCode based on the country name
    let country = countryList.find(item => item.name === countryName);
    country === undefined ? notSupported() : countryCode = country.countryCode;
    

    //call holiday information based on countryCode
    if(country){
        fetch(`https://date.nager.at/api/v3/PublicHolidays/2025/${countryCode}`)
        .then(res => res.json())
        .then(data => {
            showHolidayData(data, country.name, countryCode);
        })
        .catch(err => {
            console.log(`error ${err}`)
        });
    }

}

function showHolidayData(holidays,country, countryCode){
    //clear previous list of holidays
    document.querySelector('#holidayList').innerHTML = '';

    document.querySelector('#countryName').innerHTML = country;
    holidays.forEach(holiday => {
        let li = document.createElement('li');
        let dateObj = new Date(holiday.date);
        let formattedDate = dateObj.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric', 
            year: 'numeric'
        });
        li.textContent = `${formattedDate} : ${holiday.name}`
        document.querySelector('#holidayList').appendChild(li);
    })
}

function notSupported(){
    //clear previous list of holidays
    document.querySelector('#holidayList').innerHTML = '';
    document.querySelector('#countryName').innerHTML = 'we don\'t have data on that one!';
}

function colorMap(countryCode){
    if(previousCountryCode !== ''){
        document.querySelector(`#${previousCountryCode}`).style.fill = 'black';
        document.querySelector(`#${countryCode}`).style.fill = 'blue';
    }
    else{
        document.querySelector(`#${countryCode}`).style.fill = 'blue';
    }
    previousCountryCode = countryCode;
}