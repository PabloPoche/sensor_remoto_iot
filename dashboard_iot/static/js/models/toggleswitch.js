
"use strict";

const toggle_switches = document.querySelectorAll(".toggle_switch_container");

// Version utilizando foreach
toggle_switches.forEach(sw => {
    // Get data to build element
    const name = sw.textContent;
    
    const id = sw.id;
    // Remove element ID
    sw.removeAttribute('id');

    sw.innerHTML = `
        <span>${name}</span>
        <div class="toggle_switch">
            <input type="checkbox" id="${id}" />
            <label for="${id}"></label>
        </div>
    `;
});

const toggle_sliders = document.querySelectorAll(".toggle_slider_container");

toggle_sliders.forEach(sw => {
    // Get data to build element
    const name = sw.textContent;
    
    const id = sw.id;
    // Remove element ID
    sw.removeAttribute('id');

    sw.innerHTML = `
        <span>${name}</span>
        <div class="toggle_slider">
            <input type="checkbox" id="${id}"/>
            <label for="${id}"></label>
        </div>
    `;
});

